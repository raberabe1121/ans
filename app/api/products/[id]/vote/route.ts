import { NextResponse } from 'next/server'
import { createSupabaseAdmin, createSupabaseServerClient } from '@/lib/supabase'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authClient = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const supabase = createSupabaseAdmin()
    const { error: voteError } = await supabase.from('votes').insert({ product_id: id, user_id: user.id })
    if (voteError) {
      if (voteError.code === '23505') {
        return NextResponse.json({ error: 'Already voted' }, { status: 409 })
      }
      throw voteError
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('vote_count')
      .eq('id', id)
      .single()
    if (productError) throw productError

    const voteCount = (product.vote_count ?? 0) + 1
    const { error: updateError } = await supabase.from('products').update({ vote_count: voteCount }).eq('id', id)
    if (updateError) throw updateError

    return NextResponse.json({ vote_count: voteCount })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
