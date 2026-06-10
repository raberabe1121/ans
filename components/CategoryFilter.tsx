import Link from 'next/link'
import type { Category } from '@/types'

const categories: { label: string; value?: Category }[] = [
  { label: 'All' },
  { label: 'AIエージェント', value: 'agent' },
  { label: 'バイブコーディング産', value: 'vibe' },
  { label: 'OSS', value: 'oss' },
  { label: 'ツール', value: 'tool' },
]

export function CategoryFilter({ active, q }: { active?: string; q?: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const params = new URLSearchParams()
        if (category.value) params.set('category', category.value)
        if (q) params.set('q', q)
        const isActive = (category.value ?? '') === (active ?? '')
        return (
          <Link
            key={category.label}
            href={`/?${params.toString()}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
              isActive ? 'border-teal-300 bg-teal-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {category.label}
          </Link>
        )
      })}
    </div>
  )
}
