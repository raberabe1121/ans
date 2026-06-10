import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createSupabaseAdmin()

    const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', id).single()
    if (productError) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const { data: posts, error: postsError } = await supabase
      .from('x_posts')
      .select('*')
      .eq('product_id', id)
      .order('posted_at', { ascending: true })

    if (postsError) throw postsError

    return NextResponse.json({ product: { ...product, x_posts: posts ?? [] } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
