import { CategoryFilter } from '@/components/CategoryFilter'
import { LoginButton } from '@/components/LoginButton'
import { ProductList } from '@/components/ProductList'
import { SearchBar } from '@/components/SearchBar'
import { createSupabaseAdmin } from '@/lib/supabase'
import type { Category, Product, Sort } from '@/types'

export const dynamic = 'force-dynamic'

async function getProducts(searchParams: { q?: string; category?: string; sort?: string }): Promise<Product[]> {
  try {
    const supabase = createSupabaseAdmin()
    const categories: Category[] = ['agent', 'vibe', 'oss', 'tool', 'unknown']
    const sort = (searchParams.sort ?? 'votes') as Sort
    let query = supabase.from('products').select('*')

    if (searchParams.q) {
      const q = searchParams.q.trim()
      query = query.or(`name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%,maker_x_username.ilike.%${q}%`)
    }

    if (searchParams.category && categories.includes(searchParams.category as Category)) {
      query = query.eq('category', searchParams.category)
    }

    if (sort === 'newest') query = query.order('created_at', { ascending: false })
    else if (sort === 'active') query = query.order('last_posted_at', { ascending: false, nullsFirst: false })
    else query = query.order('vote_count', { ascending: false }).order('last_posted_at', { ascending: false, nullsFirst: false })

    const { data, error } = await query.limit(50)
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('Failed to load products', error)
    return []
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }) {
  const params = await searchParams
  const products = await getProducts(params)

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <a href="/" className="text-3xl font-black tracking-tight text-white">
          ANS<span className="text-teal-300">.dev</span>
        </a>
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:justify-end">
          <SearchBar />
          <LoginButton />
        </div>
      </header>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-bold text-teal-100">
            投稿するだけで登録される Agent Name Server
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-7xl">
            #ANS のBuild in Publicからプロダクトページを自動生成。
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            バイブコーダーはXで <code className="rounded bg-white/10 px-2 py-1">#ANS</code> をつけてポストするだけ。ANSが収集し、Claudeがページ化し、発見者が投票できます。
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Products</h2>
            <p className="mt-1 text-sm text-slate-400">自動収集されたプロダクト一覧</p>
          </div>
          <CategoryFilter active={params.category} q={params.q} />
        </div>
        <ProductList products={products} />
      </section>
    </main>
  )
}
