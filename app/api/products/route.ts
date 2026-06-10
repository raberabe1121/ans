import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import type { Category, Sort } from '@/types'

const categories: Category[] = ['agent', 'vibe', 'oss', 'tool', 'unknown']
const sorts: Sort[] = ['votes', 'newest', 'active']

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const category = searchParams.get('category') as Category | null
    const sort = (searchParams.get('sort') ?? 'votes') as Sort

    const supabase = createSupabaseAdmin()
    let query = supabase.from('products').select('*')

    if (q) {
      query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%,maker_x_username.ilike.%${q}%`)
    }

    if (category && categories.includes(category)) {
      query = query.eq('category', category)
    }

    if (sorts.includes(sort) && sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sorts.includes(sort) && sort === 'active') {
      query = query.order('last_posted_at', { ascending: false, nullsFirst: false })
    } else {
      query = query.order('vote_count', { ascending: false }).order('last_posted_at', { ascending: false, nullsFirst: false })
    }

    const { data, error } = await query.limit(50)
    if (error) throw error

    return NextResponse.json({ products: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
