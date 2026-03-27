import prisma from '@/lib/db'
import { Metadata } from 'next'
import ShopCard from '@/components/ShopCard'
import ShopFilters from '@/components/ShopFilters'
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
  type?: string
  category?: string
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

  if (params.type === 'physical') {
    where.isPhysicalStore = true
  } else if (params.type === 'webshop') {
    where.isWebshop = true
  }

  if (params.category) {
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: params.category },
    })
    if (categoryRecord) {
      where.categories = { some: { categoryId: categoryRecord.id } }
    }
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

async function getFilterData() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  // Get cities that actually have approved shops
  const shopsWithCities = await prisma.shop.findMany({
    where: { status: 'APPROVED', city: { not: null } },
    select: { city: true, citySlug: true, country: true },
    distinct: ['citySlug'],
    orderBy: { city: 'asc' },
  })

  const citiesBE = shopsWithCities
    .filter(s => s.country === 'BE' && s.city && s.citySlug)
    .map(s => ({ name: s.city!, slug: s.citySlug! }))

  const citiesNL = shopsWithCities
    .filter(s => s.country === 'NL' && s.city && s.citySlug)
    .map(s => ({ name: s.city!, slug: s.citySlug! }))

  return { categories, citiesBE, citiesNL }
}

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [shops, filterData] = await Promise.all([
    getShops(params),
    getFilterData(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Alle Winkels
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ontdek de beste islamitische kledingwinkels in Nederland en België
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-64 shrink-0">
          <ShopFilters
            categories={filterData.categories}
            citiesBE={filterData.citiesBE}
            citiesNL={filterData.citiesNL}
            activeCountry={params.country}
            activeCity={params.city}
            activeType={params.type}
            activeCategory={params.category}
            activeSearch={params.search}
          />
        </aside>

        {/* Shop listing */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {shops.length} winkel{shops.length !== 1 ? 's' : ''} gevonden
            </p>
          </div>

          {shops.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 mb-4">Geen winkels gevonden met deze filters</p>
              <a href="/shops" className="text-accent hover:underline">
                Alle filters wissen
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </main>
      </div>

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
