import prisma from '@/lib/db'
import { Metadata } from 'next'
import ShopCard from '@/components/ShopCard'
import SearchFilter from '@/components/SearchFilter'
import { generateLocalBusinessJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Alle Winkels | ModestDirectory',
  description: 'Ontdek de beste islamitische kledingwinkels in Nederland en België. Hijabs, abayas, modest fashion en meer.',
}

type SearchParams = {
  search?: string
  country?: string
  city?: string
}

async function getShops(params: SearchParams) {
  const where: any = { status: 'APPROVED' }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { shortDescription: { contains: params.search, mode: 'insensitive' } },
      { city: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.country) {
    where.country = params.country
  }

  if (params.city) {
    where.citySlug = params.city
  }

  return prisma.shop.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      city: true,
      country: true,
      isPhysicalStore: true,
      isWebshop: true,
      isFeatured: true,
      logoUrl: true,
      websiteUrl: true,
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Alle Winkels
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Ontdek de beste islamitische kledingwinkels in Nederland en België
        </p>
        <SearchFilter />
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Geen winkels gevonden</p>
          <a href="/shops" className="text-accent hover:underline">
            Bekijk alle winkels
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}

      {/* SEO: Local Business Schema */}
      {shops.slice(0, 10).map(shop => (
        <script
          key={shop.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessJsonLd(shop))
          }}
        />
      ))}
    </div>
  )
}
