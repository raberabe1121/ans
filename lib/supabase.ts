import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new Error(`${name} is required`)
  return value
}

export function createSupabaseAdmin() {
  return createClient(
    requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv(supabaseServiceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    requireEnv(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot set cookies. Auth mutations happen in route handlers.
          }
        },
      },
    }
  )
}
