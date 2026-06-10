import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostTimeline } from '@/components/PostTimeline'
import { VoteButton } from '@/components/VoteButton'
import { createSupabaseAdmin } from '@/lib/supabase'
import type { Product, XPost } from '@/types'

export const dynamic = 'force-dynamic'

async function getProduct(id: string): Promise<(Product & { x_posts: XPost[] }) | null> {
  try {
    const supabase = createSupabaseAdmin()
    const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', id).single()
    if (productError || !product) return null

    const { data: posts, error: postsError } = await supabase
      .from('x_posts')
      .select('*')
      .eq('product_id', id)
      .order('posted_at', { ascending: true })
    if (postsError) throw postsError

    return { ...product, x_posts: posts ?? [] }
  } catch (error) {
    console.error('Failed to load product', error)
    return null
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white">
          ANS<span className="text-teal-300">.dev</span>
        </Link>
        <Link href="/" className="text-sm text-slate-300 hover:text-white">
          ← 一覧へ戻る
        </Link>
      </header>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-indigo-400/15 px-3 py-1 font-bold text-indigo-100">{product.category}</span>
              <span>@{product.maker_x_username}</span>
              <span>{product.post_count} posts</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{product.name}</h1>
            <p className="mt-4 text-xl leading-8 text-teal-100">{product.tagline}</p>
            {product.description ? <p className="mt-6 leading-8 text-slate-300">{product.description}</p> : null}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950"
              >
                外部リンクを開く →
              </a>
            ) : null}
          </div>
          <VoteButton productId={product.id} initialCount={product.vote_count} />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black text-white">PostTimeline</h2>
          <p className="mt-1 text-sm text-slate-400">プロダクトが作られていくオーセンティックなストーリー</p>
        </div>
        <PostTimeline posts={product.x_posts} />
      </section>
    </main>
  )
}
