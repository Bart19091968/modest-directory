import prisma from '@/lib/db'
import { Metadata } from 'next'
import ShopCard from '@/components/ShopCard'
import SearchFilter from '@/components/SearchFilter'
import ShopFilters from '@/components/ShopFilters'
import { generateLocalBusinessJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Islamitische Kledingwinkels - Hijab & Abaya Shops | ModestDirectory',
  description: 'Ontdek alle islamitische kledingwinkels in Nederland en België. Hijab shops, abaya winkels, modest fashion webshops en meer. Filter op locatie, lees reviews en vind de beste winkel.',
  alternates: {
    canonical: '/shops',
  },
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

  // Multi-value: country=BE,NL
  if (params.country) {
    const countries = params.country.split(',').filter(Boolean)
    if (countries.length === 1) {
      where.country = countries[0]
    } else if (countries.length > 1) {
      where.country = { in: countries }
    }
  }

  // Multi-value: city=brussel,antwerpen
  if (params.city) {
    const cities = params.city.split(',').filter(Boolean)
    if (cities.length === 1) {
      where.citySlug = cities[0]
    } else if (cities.length > 1) {
      where.citySlug = { in: cities }
    }
  }

  // Multi-value: type=webshop,physical
  if (params.type) {
    const types = params.type.split(',').filter(Boolean)
    if (types.includes('physical') && types.includes('webshop')) {
      // Both selected: show shops that are either
      where.OR = [
        ...(where.OR || []),
        { isPhysicalStore: true },
        { isWebshop: true },
      ]
      // Actually both checked means no filter needed since all shops are one or the other
      // But let's keep it explicit
    } else if (types.includes('physical')) {
      where.isPhysicalStore = true
    } else if (types.includes('webshop')) {
      where.isWebshop = true
    }
  }

  // Multi-value: category=hijab-shops,abaya-shops
  if (params.category) {
    const categorySlugs = params.category.split(',').filter(Boolean)
    if (categorySlugs.length > 0) {
      const categoryRecords = await prisma.category.findMany({
        where: { slug: { in: categorySlugs } },
        select: { id: true },
      })
      if (categoryRecords.length > 0) {
        where.categories = {
          some: { categoryId: { in: categoryRecords.map(c => c.id) } },
        }
      }
    }
  }

  const shops = await prisma.shop.findMany({
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
      googlePlaceId: true,
      googleRating: true,
      googleReviewCount: true,
      subscriptionTier: true,
      facebookUrl: true,
      instagramUrl: true,
      pinterestUrl: true,
      youtubeUrl: true,
      tiktokUrl: true,
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
  })
  const TIER_ORDER: Record<string, number> = { GOLD: 0, SILVER: 1, BRONZE: 2 }
  return [...shops].sort((a, b) =>
    (TIER_ORDER[a.subscriptionTier ?? ''] ?? 3) - (TIER_ORDER[b.subscriptionTier ?? ''] ?? 3)
  )
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
      {/* Header + Search bar on top */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Alle Winkels
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Ontdek de beste islamitische kledingwinkels in Nederland en België
        </p>
        <SearchFilter />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <ShopFilters
            categories={filterData.categories}
            citiesBE={filterData.citiesBE}
            citiesNL={filterData.citiesNL}
          />
        </aside>

        {/* Shop listing */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
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
