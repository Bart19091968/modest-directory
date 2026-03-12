import { Metadata } from 'next'
import prisma from '@/lib/db'
import ShopCard from '@/components/ShopCard'
import SearchFilter from '@/components/SearchFilter'

export const metadata: Metadata = {
  title: 'Alle Islamitische Kledingwinkels',
  description: 'Bekijk alle hijab shops, abaya winkels en modest fashion winkels in Nederland en België. Filter op land, type en reviews.',
}

export const revalidate = 3600

type SearchParams = {
  country?: string
  type?: string
  q?: string
}

async function getShops(searchParams: SearchParams) {
  const where: Record<string, unknown> = {
    status: 'APPROVED',
  }

  if (searchParams.country === 'BE' || searchParams.country === 'NL') {
    where.country = searchParams.country
  }

  if (searchParams.type === 'webshop') {
    where.isWebshop = true
  } else if (searchParams.type === 'fysiek') {
    where.isPhysicalStore = true
  }

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { shortDescription: { contains: searchParams.q, mode: 'insensitive' } },
      { city: { contains: searchParams.q, mode: 'insensitive' } },
    ]
  }

  return prisma.shop.findMany({
    where,
    include: {
      reviews: {
        where: { isVerified: true },
        select: { score: true },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const shops = await getShops(params)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Islamitische Kledingwinkels
        </h1>
        <p className="text-gray-600">
          {shops.length} {shops.length === 1 ? 'winkel' : 'winkels'} gevonden
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <SearchFilter />
        </aside>

        {/* Results */}
        <div className="flex-grow">
          {shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shops.map(shop => {
                const avgRating = shop.reviews.length > 0
                  ? shop.reviews.reduce((sum, r) => sum + r.score, 0) / shop.reviews.length
                  : 0
                return (
                  <ShopCard 
                    key={shop.id} 
                    shop={{
                      ...shop,
                      averageRating: avgRating,
                      reviewCount: shop.reviews.length,
                    }}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-4">Geen winkels gevonden met deze filters.</p>
              <a href="/shops" className="text-accent hover:underline">
                Bekijk alle winkels →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
