import prisma from '@/lib/db'
import { Metadata } from 'next'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'
import SearchFilter from '@/components/SearchFilter'
import ShopFilters from '@/components/ShopFilters'
import FAQSection from '@/components/FAQSection'
import { generateLocalBusinessJsonLd, generateFAQJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Islamitische Kledingwinkels - Hijab & Abaya Shops | ModestDirectory',
  description: 'Ontdek alle islamitische kledingwinkels in Nederland en België. Hijab shops, abaya winkels, modest fashion webshops en meer. Filter op locatie, lees reviews en vind de beste winkel.',
  alternates: {
    canonical: '/shops',
  },
  openGraph: {
    title: 'Islamitische Kledingwinkels - Hijab & Abaya Shops | ModestDirectory',
    description: 'Ontdek alle islamitische kledingwinkels in Nederland en België. Filter op locatie, lees reviews en vind de beste winkel.',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'ModestDirectory - Alle Winkels' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Islamitische Kledingwinkels | ModestDirectory',
    description: 'Ontdek hijab shops, abaya winkels en modest fashion in NL & BE.',
    images: ['/icon-512.png'],
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

  if (params.country) {
    const countries = params.country.split(',').filter(Boolean)
    if (countries.length === 1) {
      where.country = countries[0]
    } else if (countries.length > 1) {
      where.country = { in: countries }
    }
  }

  if (params.city) {
    const cities = params.city.split(',').filter(Boolean)
    if (cities.length === 1) {
      where.citySlug = cities[0]
    } else if (cities.length > 1) {
      where.citySlug = { in: cities }
    }
  }

  if (params.type) {
    const types = params.type.split(',').filter(Boolean)
    if (types.includes('physical') && types.includes('webshop')) {
      where.OR = [
        ...(where.OR || []),
        { isPhysicalStore: true },
        { isWebshop: true },
      ]
    } else if (types.includes('physical')) {
      where.isPhysicalStore = true
    } else if (types.includes('webshop')) {
      where.isWebshop = true
    }
  }

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

async function getFAQs() {
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 5,
  })
}

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [shops, filterData, faqs] = await Promise.all([
    getShops(params),
    getFilterData(),
    getFAQs(),
  ])

  const faqSchema = faqs.length > 0 ? generateFAQJsonLd(faqs) : null

  return (
    <div className="min-h-screen">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <span>Alle Winkels</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Alle Islamitische Kledingwinkels in Nederland & België
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Ontdek hijab shops, abaya winkels en modest fashion boutiques. Filter op locatie, lees reviews en vind de beste winkel bij jou in de buurt.
          </p>
          <SearchFilter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="mb-12 mt-12">
          <FAQSection faqs={faqs} />
        </section>
      )}

      {/* Editorial text */}
      <section className="prose prose-lg max-w-none bg-gray-50 rounded-xl p-8 mt-4">
        <h2>Modest fashion winkels — wereldwijd gecureerd</h2>
        <p>
          Er is een moment waarop zoeken overgaat in vinden. Niet door toeval, maar door selectie. Op{' '}
          <strong>ModestDirectory.com/shops</strong> komt de wereld van <em>modest fashion</em> samen
          in een zorgvuldig gecureerd overzicht van winkels die begrijpen dat stijl niet luid hoeft
          te zijn om op te vallen.
        </p>
        <p>
          Van verfijnde hijabmerken tot eigentijdse modest wear labels — hier ontdek je boutiques die
          uitblinken in kwaliteit, pasvorm en esthetiek. Denk aan neutrale paletten, vloeiende
          silhouetten en materialen die even comfortabel als elegant aanvoelen. Het is een selectie
          die aansluit bij de groeiende vraag naar ingetogen luxe en minimalistische mode, zonder in
          te boeten op persoonlijkheid.
        </p>
        <p>
          Of je nu gericht op zoek bent naar een nieuwe favoriete shop of simpelweg wilt bladeren
          voor inspiratie, deze pagina biedt een helder vertrekpunt. Geen overdaad, maar een
          doordachte verzameling van winkels die bescheiden mode naar een hoger niveau tillen —
          wereldwijd, toegankelijk en altijd in beweging.
        </p>
      </section>

      {/* SEO: Shop ItemList Schema */}
      {shops.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Islamitische kledingwinkels in Nederland en België',
              itemListElement: shops.slice(0, 10).map((shop, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: generateLocalBusinessJsonLd(shop),
              })),
            })
          }}
        />
      )}
      </div>
    </div>
  )
}