import Image from 'next/image'
import type { XPost } from '@/types'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function PostTimeline({ posts }: { posts: XPost[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>@{post.author_x_username}</span>
            <time>{formatDate(post.posted_at)}</time>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-100">{post.content}</p>
          {post.media_urls.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {post.media_urls.map((url) => (
                <div key={url} className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
                  <Image src={url} alt="Post media" fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
            <span>♡ {post.likes}</span>
            <span>↻ {post.retweets}</span>
            <a
              href={`https://x.com/${post.author_x_username}/status/${post.post_id}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-teal-200 hover:text-teal-100"
            >
              Xで見る →
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}
