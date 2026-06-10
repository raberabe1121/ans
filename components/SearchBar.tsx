'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = new URLSearchParams(params.toString())
    if (query.trim()) next.set('q', query.trim())
    else next.delete('q')
    router.push(`/?${next.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="プロダクト、タグ、作者を検索"
        className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-300/70"
      />
      <button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950">検索</button>
    </form>
  )
}
