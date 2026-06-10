'use client'

import { useState, useTransition } from 'react'

export function VoteButton({ productId, initialCount }: { productId: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [status, setStatus] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function vote() {
    setStatus(null)
    startTransition(async () => {
      const res = await fetch(`/api/products/${productId}/vote`, { method: 'POST' })
      const json = await res.json()

      if (!res.ok) {
        setStatus(json.error === 'Authentication required' ? 'Xでログインすると投票できます' : json.error)
        return
      }

      setCount(json.vote_count)
      setStatus('投票しました')
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={vote}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full border border-teal-300/40 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-300/20 disabled:opacity-60"
      >
        ▲ <span>{count}</span>
      </button>
      {status ? <p className="text-xs text-slate-400">{status}</p> : null}
    </div>
  )
}
