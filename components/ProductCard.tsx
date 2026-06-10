import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { VoteButton } from './VoteButton'

const categoryLabels: Record<Product['category'], string> = {
  agent: 'AI Agent',
  vibe: 'Vibe',
  oss: 'OSS',
  tool: 'Tool',
  unknown: 'Unknown',
}

function formatDate(value: string | null) {
  if (!value) return 'No posts yet'
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' }).format(new Date(value))
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-white/[0.09]">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/products/${product.id}`} className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-3">
            {product.maker_x_avatar ? (
              <Image
                src={product.maker_x_avatar}
                alt=""
                width={40}
                height={40}
                className="rounded-full bg-slate-700"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-300 to-indigo-400" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">@{product.maker_x_username}</p>
              <p className="truncate text-xs text-slate-400">{product.maker_x_name ?? 'Build in public'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="line-clamp-2 text-2xl font-black tracking-tight text-white">{product.name}</h2>
            <p className="line-clamp-2 text-sm leading-6 text-slate-300">{product.tagline}</p>
          </div>
        </Link>
        <VoteButton productId={product.id} initialCount={product.vote_count} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-bold text-indigo-100">
          {categoryLabels[product.category]}
        </span>
        {product.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
        <span>Latest: {formatDate(product.last_posted_at)}</span>
        <span className="rounded-full bg-white/10 px-3 py-1">{product.post_count} posts</span>
      </div>
    </article>
  )
}
