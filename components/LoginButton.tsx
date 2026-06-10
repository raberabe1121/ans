'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase'

export function LoginButton() {
  async function signIn() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <button
      onClick={signIn}
      className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15"
    >
      Xでログイン
    </button>
  )
}
