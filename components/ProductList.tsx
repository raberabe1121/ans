import type { Product } from '@/types'
import { ProductCard } from './ProductCard'

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-10 text-center">
        <p className="text-lg font-bold text-white">まだプロダクトがありません</p>
        <p className="mt-2 text-sm text-slate-400">Xで #ANS をつけてBuild in Publicすると自動登録されます。</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
