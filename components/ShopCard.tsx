import Link from 'next/link'

type Review = {
  score: number
}

type Shop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  city: string | null
  country: string
  isPhysicalStore: boolean
  isWebshop: boolean
  isFeatured?: boolean
  logoUrl?: string | null
  reviews: Review[]
}

export default function ShopCard({ shop }: { shop: Shop }) {
  const averageScore = shop.reviews.length > 0
    ? shop.reviews.reduce((acc, r) => acc + r.score, 0) / shop.reviews.length
    : null

  const firstLetter = shop.name.charAt(0).toUpperCase()

  return (
    <Link href={`/shops/${shop.slug}`} className="card p-6 block">
      <div className="flex gap-4 mb-3">
        {/* Logo or first letter */}
        <div className="flex-shrink-0">
          {shop.logoUrl ? (
            <img 
              src={shop.logoUrl} 
              alt={`${shop.name} logo`}
              className="w-14 h-14 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">{firstLetter}</span>
            </div>
          )}
        </div>

        {/* Name and featured badge */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{shop.name}</h3>
            {shop.isFeatured && (
              <span className="text-yellow-500 flex-shrink-0">⭐</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📍 {shop.city || shop.country}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {shop.shortDescription}
      </p>
      
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {shop.isWebshop && (
          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">
            Webshop
          </span>
        )}
        {shop.isPhysicalStore && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
            Fysieke winkel
          </span>
        )}
      </div>
      
      {averageScore !== null ? (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= Math.round(averageScore) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {averageScore.toFixed(1)} ({shop.reviews.length} reviews)
          </span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">Nog geen reviews</span>
      )}
    </Link>
  )
}
