import { NextResponse } from 'next/server'
import { analyzePostsAndGenerateProduct, updateProductFromNewPost } from '@/lib/claude'
import { createSupabaseAdmin } from '@/lib/supabase'
import { filterNewPosts, groupByAuthor, searchRecentPosts } from '@/lib/x-api'
import type { NormalizedPost } from '@/types'

function isAuthorized(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return true
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${cronSecret}`
}

async function logCollect(stats: {
  posts_found: number
  products_created: number
  products_updated: number
  error?: string
}) {
  try {
    const supabase = createSupabaseAdmin()
    await supabase.from('collect_logs').insert(stats)
  } catch (error) {
    console.error('Failed to write collect log', error)
  }
}

function toPostInsert(post: NormalizedPost, productId: string) {
  return {
    post_id: post.id,
    product_id: productId,
    content: post.text,
    author_x_id: post.author_id,
    author_x_username: post.username,
    media_urls: post.media_urls,
    likes: post.public_metrics.like_count ?? 0,
    retweets: post.public_metrics.retweet_count ?? 0,
    posted_at: post.created_at,
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stats = { posts_found: 0, products_created: 0, products_updated: 0 }

  try {
    const supabase = createSupabaseAdmin()
    const xData = await searchRecentPosts()
    const posts = xData.data ?? []
    const users = xData.includes?.users ?? []
    const media = xData.includes?.media ?? []
    stats.posts_found = posts.length

    const grouped = groupByAuthor(posts, users, media)

    for (const [authorId, authorPosts] of Object.entries(grouped)) {
      const { data: existing, error: existingError } = await supabase
        .from('products')
        .select('*')
        .eq('maker_x_id', authorId)
        .maybeSingle()

      if (existingError) throw existingError

      if (existing) {
        const newPosts = filterNewPosts(authorPosts, existing.last_posted_at)
        if (newPosts.length === 0) continue

        const { error: postsError } = await supabase
          .from('x_posts')
          .upsert(newPosts.map((post) => toPostInsert(post, existing.id)), { onConflict: 'post_id' })
        if (postsError) throw postsError

        const updated = await updateProductFromNewPost(existing, newPosts[0].text)
        const { error: updateError } = await supabase
          .from('products')
          .update({
            ...updated,
            post_count: (existing.post_count ?? 0) + newPosts.length,
            last_posted_at: newPosts[0].created_at,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
        if (updateError) throw updateError
        stats.products_updated += 1
      } else {
        const analyzed = await analyzePostsAndGenerateProduct(
          authorPosts.map((post) => ({
            content: post.text,
            posted_at: post.created_at,
            media_urls: post.media_urls,
          }))
        )

        const newestPost = authorPosts[0]
        const oldestPost = authorPosts[authorPosts.length - 1]
        const { data: product, error: insertError } = await supabase
          .from('products')
          .insert({
            ...analyzed,
            maker_x_id: authorId,
            maker_x_username: newestPost.username,
            maker_x_name: newestPost.name,
            maker_x_avatar: newestPost.avatar,
            post_count: authorPosts.length,
            first_posted_at: oldestPost.created_at,
            last_posted_at: newestPost.created_at,
          })
          .select()
          .single()
        if (insertError) throw insertError

        const { error: postsError } = await supabase
          .from('x_posts')
          .insert(authorPosts.map((post) => toPostInsert(post, product.id)))
        if (postsError) throw postsError
        stats.products_created += 1
      }
    }

    await logCollect(stats)
    return NextResponse.json({ ok: true, ...stats })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await logCollect({ ...stats, error: message })
    return NextResponse.json({ error: message, ...stats }, { status: 500 })
  }
}
