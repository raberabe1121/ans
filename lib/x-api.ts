import type { NormalizedPost, XApiMedia, XApiTweet, XApiUser } from '@/types'

const BEARER_TOKEN = process.env.X_BEARER_TOKEN

export interface XRecentSearchResponse {
  data?: XApiTweet[]
  includes?: {
    users?: XApiUser[]
    media?: XApiMedia[]
  }
  meta?: Record<string, unknown>
}

export async function searchRecentPosts(query = '#ANS vibe coding -is:retweet (lang:ja OR lang:en)') {
  if (!BEARER_TOKEN) throw new Error('X_BEARER_TOKEN is required')

  const params = new URLSearchParams({
    query,
    max_results: '100',
    'tweet.fields': 'created_at,author_id,public_metrics,attachments',
    'user.fields': 'name,username,profile_image_url',
    expansions: 'author_id,attachments.media_keys',
    'media.fields': 'url,preview_image_url,type',
  })

  const res = await fetch(`https://api.twitter.com/2/tweets/search/recent?${params}`, {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`X API error: ${res.status} ${body}`)
  }

  return (await res.json()) as XRecentSearchResponse
}

export function groupByAuthor(
  posts: XApiTweet[],
  users: XApiUser[],
  media: XApiMedia[]
): Record<string, NormalizedPost[]> {
  const usersById = new Map(users.map((user) => [user.id, user]))
  const mediaByKey = new Map(media.map((item) => [item.media_key, item]))
  const grouped: Record<string, NormalizedPost[]> = {}

  for (const post of posts) {
    const user = usersById.get(post.author_id)
    if (!user) continue

    const mediaUrls = post.attachments?.media_keys
      ?.map((key) => mediaByKey.get(key))
      .filter((item): item is XApiMedia => Boolean(item))
      .map((item) => item.url ?? item.preview_image_url)
      .filter((url): url is string => Boolean(url)) ?? []

    const normalized: NormalizedPost = {
      id: post.id,
      text: post.text,
      created_at: post.created_at,
      author_id: post.author_id,
      username: user.username,
      name: user.name,
      avatar: user.profile_image_url,
      media_urls: mediaUrls,
      public_metrics: post.public_metrics,
    }

    grouped[post.author_id] = [...(grouped[post.author_id] ?? []), normalized]
  }

  for (const authorId of Object.keys(grouped)) {
    grouped[authorId].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
  }

  return grouped
}

export function filterNewPosts(posts: NormalizedPost[], lastPostedAt: string | null) {
  if (!lastPostedAt) return posts
  const lastPostedTime = Date.parse(lastPostedAt)
  return posts.filter((post) => Date.parse(post.created_at) > lastPostedTime)
}
