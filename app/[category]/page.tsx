import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'
import FAQSection from '@/components/FAQSection'

export const dynamic = 'force-dynamic'

const categoryNames: Record<string, string> = {
  'hijab-shops': 'Hijab Shops',
  'abaya-shops': 'Abaya Winkels',
  'modest-fashion': 'Modest Fashion',
  'islamitische-kleding': 'Islamitische Kleding',
}

const categoryKeywords: Record<string, string[]> = {
  'hijab-shops': ['hijab', 'hoofddoek', 'sjaals', 'underscarfs', 'hijab accessoires', 'instant hijabs', 'jersey hijabs', 'chiffon hijabs', 'satijnen hijabs'],
  'abaya-shops': ['abaya', 'jilbab', 'gebedsjurk', 'kimono abaya', 'open abaya', 'gesloten abaya', 'abaya set', 'abaya met riem'],
  'modest-fashion': ['modest fashion', 'bescheiden kleding', 'lange jurken', 'maxi rokken', 'wijde broeken', 'tuniek', 'modest tops', 'modest zwemkleding'],
  'islamitische-kleding': ['islamitische kleding', 'moslim kleding', 'gebedkleding', 'thobe', 'kaftan', 'djellaba', 'islamitische mode', 'halal fashion'],
}

type Params = {
  category: string
}

async function getData(categorySlug: string) {
  // Only handle known category slugs — let other paths fall through
  if (!categoryNames[categorySlug]) return null

  const categoryRecord = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      ...(categoryRecord ? {
        categories: { some: { categoryId: categoryRecord.id } },
      } : {}),
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
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
      subscriptionTier: true,
      facebookUrl: true,
      instagramUrl: true,
      pinterestUrl: true,
      youtubeUrl: true,
      tiktokUrl: true,
      googlePlaceId: true,
      googleRating: true,
      googleReviewCount: true,
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
  })

  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 5,
  })

  const countries = await prisma.country.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  const TIER_ORDER: Record<string, number> = { GOLD: 0, SILVER: 1, BRONZE: 2 }
  const sortedShops = [...shops].sort((a, b) =>
    (TIER_ORDER[a.subscriptionTier ?? ''] ?? 3) - (TIER_ORDER[b.subscriptionTier ?? ''] ?? 3)
  )

  return { shops: sortedShops, faqs, countries, categoryRecord }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const categoryName = categoryNames[params.category]
  if (!categoryName) return { title: 'Niet gevonden' }

  const currentYear = new Date().getFullYear()
  const title = `${categoryName} | Nederland & België ${currentYear} | ModestDirectory`
  const description = `Ontdek de beste ${categoryName.toLowerCase()} in Nederland en België. Alle islamitische kledingwinkels op één plek — vergelijk reviews, openingstijden en webshops.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.category}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: '/icon-512.png', width: 512, height: 512, alt: categoryName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon-512.png'],
    },
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const data = await getData(params.category)

  if (!data) notFound()

  const categoryName = categoryNames[params.category]
  const keywords = categoryKeywords[params.category] || []
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Winkels', item: `${siteUrl}/shops` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `${siteUrl}/${params.category}` },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><span className="mx-2">›</span></li>
          <li><Link href="/shops" className="hover:text-accent">Winkels</Link></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-gray-900" aria-current="page">{categoryName}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {categoryName}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Ontdek de beste {categoryName.toLowerCase()} in Nederland en België.
          {data.shops.length > 0
            ? ` We hebben ${data.shops.length} ${data.shops.length !== 1 ? 'winkels' : 'winkel'} voor je verzameld.`
            : ' Binnenkort meer winkels beschikbaar.'
          }
        </p>
      </header>

      {/* Filter per land */}
      {data.countries.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Filter op land</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${params.category}`}
              className="px-4 py-2 bg-accent text-white rounded-full text-sm font-medium"
            >
              Alle landen
            </Link>
            {data.countries.map(country => (
              <Link
                key={country.id}
                href={`/${params.category}/${country.slug}`}
                className="px-4 py-2 bg-white border rounded-full text-sm hover:border-accent hover:text-accent transition"
              >
                {country.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Shop lijst */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {data.shops.length > 0
            ? `Alle ${categoryName} (${data.shops.length})`
            : categoryName
          }
        </h2>

        {data.shops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">
              We zijn nog bezig met het toevoegen van {categoryName.toLowerCase()}.
            </p>
            <p className="text-gray-600 mb-6">
              Heb je een winkel? Meld je aan en bereik duizenden potentiële klanten.
            </p>
            <Link href="/aanmelden" className="btn-primary">
              Winkel aanmelden
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.shops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </section>

      {/* Andere categorieën */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Andere categorieën</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryNames)
            .filter(([slug]) => slug !== params.category)
            .map(([slug, name]) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="px-4 py-2 bg-white border rounded-full text-sm hover:border-accent hover:text-accent transition"
              >
                {name}
              </Link>
            ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section className="mb-12">
          <FAQSection faqs={data.faqs} />
        </section>
      )}

      {/* SEO content */}
      <section className="prose prose-lg max-w-none bg-gray-50 rounded-xl p-8 mt-12">
        <h2>Alles over {categoryName} in Nederland en België</h2>
        <p>
          Bij ModestDirectory vind je een volledig overzicht van alle {categoryName.toLowerCase()} in Nederland en België.
          Of je nu op zoek bent naar {keywords.slice(0, 3).join(', ')} of andere producten,
          onze directory helpt je de perfecte winkel te vinden.
        </p>
        <p>
          Elke winkel is voorzien van klantbeoordelingen zodat je altijd weet wat je kunt verwachten.
          Zowel fysieke winkels als webshops zijn opgenomen — zo vind je altijd een winkel die bij jou past,
          of je nu liever in de winkel koopt of online bestelt.
        </p>
        <h3>Winkels per land</h3>
        <p>
          Ben je op zoek naar {categoryName.toLowerCase()} in een specifiek land?
          Gebruik de landfilters hierboven om te filteren op Nederland of België,
          of klik door naar een specifieke stad voor een lokaal overzicht.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center mt-12 p-8 bg-accent/5 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Heb je een {categoryName.toLowerCase().replace(' winkels', '').replace(' shops', '')} winkel?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Meld je winkel aan bij ModestDirectory en bereik duizenden potentiële klanten
          die op zoek zijn naar {categoryName.toLowerCase()} in Nederland en België.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/aanmelden" className="btn-primary">
            Winkel aanmelden
          </Link>
          <Link href="/shops" className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition">
            Alle winkels bekijken
          </Link>
        </div>
      </section>
    </div>
  )
}
