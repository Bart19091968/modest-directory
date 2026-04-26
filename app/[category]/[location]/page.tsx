import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'
import FAQSection from '@/components/FAQSection'
import { generateFAQJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const categoryNames: Record<string, string> = {
  'hijab-shops': 'Hijab Shops',
  'abaya-shops': 'Abaya Winkels',
  'islamitische-kleding': 'Islamitische Kleding',
}

const categoryKeywords: Record<string, string[]> = {
  'hijab-shops': ['hijab', 'hoofddoek', 'sjaals', 'underscarfs', 'hijab accessoires', 'instant hijabs', 'jersey hijabs', 'chiffon hijabs', 'satijnen hijabs'],
  'abaya-shops': ['abaya', 'jilbab', 'gebedsjurk', 'kimono abaya', 'open abaya', 'gesloten abaya', 'abaya set', 'abaya met riem'],
}

type Params = {
  category: string
  location: string
}

async function getData(category: string, location: string) {
  const country = await prisma.country.findUnique({
    where: { slug: location },
  })

  const city = await prisma.city.findUnique({
    where: { slug: location },
    include: { country: true },
  })

  if (!country && !city) {
    return null
  }

  const isCountry = !!country
  const locationName = isCountry ? country!.name : city!.name
  const countryCode = isCountry ? country!.code : city!.country.code

  const categoryRecord = await prisma.category.findUnique({
    where: { slug: category },
  })

  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      country: countryCode,
      ...(isCountry ? {} : { citySlug: location }),
      ...(categoryRecord ? {
        categories: { some: { categoryId: categoryRecord.id } }
      } : {}),
    },
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

  const TIER_ORDER: Record<string, number> = { GOLD: 0, SILVER: 1, BRONZE: 2 }
  const sortedShops = [...shops].sort((a, b) =>
    (TIER_ORDER[a.subscriptionTier ?? ''] ?? 3) - (TIER_ORDER[b.subscriptionTier ?? ''] ?? 3)
  )

  const relatedCities = isCountry ? await prisma.city.findMany({
    where: { countryId: country!.id },
    orderBy: { name: 'asc' },
  }) : []

  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 5,
  })

  return {
    isCountry,
    locationName,
    countryCode,
    shops: sortedShops,
    relatedCities,
    faqs,
    country: country || city?.country,
    city,
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const categoryName = categoryNames[params.category] || params.category
  const data = await getData(params.category, params.location)

  if (!data) {
    return { title: 'Niet gevonden' }
  }

  const currentYear = new Date().getFullYear()
  const title = `${categoryName} in ${data.locationName} | Beste Winkels ${currentYear}`
  const description = `Ontdek de ${data.shops.length} beste ${categoryName.toLowerCase()} in ${data.locationName}. ✓ Beoordelingen ✓ Openingstijden ✓ Webshops. Vind jouw perfecte hijab of abaya winkel.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.category}/${params.location}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${params.category}/${params.location}`,
      images: [{ url: '/icon-512.png', width: 512, height: 512, alt: `${categoryName} in ${data.locationName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon-512.png'],
    },
    ...(data.shops.length === 0 && {
      robots: { index: false, follow: true },
    }),
  }
}

function generateBreadcrumbSchema(category: string, categoryName: string, locationName: string, isCountry: boolean, countryName?: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  
  const items = [
    { position: 1, name: 'Home', item: siteUrl },
    { position: 2, name: 'Winkels', item: `${siteUrl}/shops` },
  ]

  if (!isCountry && countryName) {
    items.push({ position: 3, name: `${categoryName} ${countryName}`, item: `${siteUrl}/${category}/${countryName.toLowerCase()}` })
    items.push({ position: 4, name: `${categoryName} ${locationName}`, item: `${siteUrl}/${category}/${locationName.toLowerCase()}` })
  } else {
    items.push({ position: 3, name: `${categoryName} ${locationName}`, item: `${siteUrl}/${category}/${locationName.toLowerCase()}` })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  }
}

function generateItemListSchema(shops: any[], category: string, location: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: shops.slice(0, 10).map((shop, index) => {
      const avgRating = shop.reviews.length > 0
        ? shop.reviews.reduce((acc: number, r: any) => acc + r.score, 0) / shop.reviews.length
        : null

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Store',
          name: shop.name,
          description: shop.shortDescription,
          url: `${siteUrl}/shops/${shop.slug}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: shop.city,
            addressCountry: shop.country,
          },
          ...(avgRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: avgRating.toFixed(1),
              reviewCount: shop.reviews.length,
              bestRating: 5,
              worstRating: 1,
            },
          }),
        },
      }
    }),
  }
}

export default async function CategoryLocationPage({ params }: { params: Params }) {
  const data = await getData(params.category, params.location)

  if (!data) {
    notFound()
  }

  const categoryName = categoryNames[params.category] || params.category
  const keywords = categoryKeywords[params.category] || []
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  // Schema markup
  const breadcrumbSchema = generateBreadcrumbSchema(
    params.category,
    categoryName,
    data.locationName,
    data.isCountry,
    data.city?.country.name
  )
  const itemListSchema = data.shops.length > 0 ? generateItemListSchema(data.shops, params.category, params.location) : null
  const faqSchema = data.faqs.length > 0 ? generateFAQJsonLd(data.faqs) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><span className="mx-2">›</span></li>
          <li><Link href="/shops" className="hover:text-accent">Winkels</Link></li>
          <li><span className="mx-2">›</span></li>
          {!data.isCountry && data.city && (
            <>
              <li>
                <Link href={`/${params.category}/${data.city.country.slug}`} className="hover:text-accent">
                  {categoryName} {data.city.country.name}
                </Link>
              </li>
              <li><span className="mx-2">›</span></li>
            </>
          )}
          <li className="text-gray-900" aria-current="page">{categoryName} {data.locationName}</li>
        </ol>
      </nav>

      {/* H1 Header met keyword */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {categoryName} in {data.locationName}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Op zoek naar de beste {categoryName.toLowerCase()} in {data.locationName}? 
          Wij hebben {data.shops.length > 0 ? data.shops.length : 'binnenkort'} {data.shops.length !== 1 ? 'winkels' : 'winkel'} voor je verzameld 
          met beoordelingen, openingstijden en contactgegevens.
        </p>
      </header>

      {/* Introductie tekst - SEO content blok 1 (~150 woorden) */}
      <section className="prose prose-lg max-w-none mb-12">
        <p>
          Welkom bij de meest complete gids voor <strong>{categoryName.toLowerCase()}</strong> in {data.locationName}. 
          Of je nu op zoek bent naar {keywords.slice(0, 3).join(', ')} of andere {categoryName.toLowerCase()} producten, 
          bij ModestDirectory vind je alle informatie die je nodig hebt om de perfecte winkel te kiezen.
        </p>
        <p>
          Onze directory bevat zowel fysieke winkels als online webshops die leveren naar {data.locationName}. 
          Elke winkel is voorzien van klantbeoordelingen, zodat je altijd weet wat je kunt verwachten. 
          {data.isCountry 
            ? ` We hebben winkels in alle grote steden van ${data.locationName}, waaronder ${data.relatedCities.slice(0, 4).map(c => c.name).join(', ')} en meer.`
            : ` Naast winkels in ${data.locationName} kun je ook kijken naar winkels in andere steden van ${data.city?.country.name}.`
          }
        </p>
      </section>

      {/* Stad links (voor land pagina's) */}
      {data.isCountry && data.relatedCities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {categoryName} per stad in {data.locationName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.relatedCities.map(city => (
              <Link
                key={city.id}
                href={`/${params.category}/${city.slug}`}
                className="px-4 py-2 bg-white border rounded-full text-sm hover:border-accent hover:text-accent transition"
              >
                {categoryName} {city.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Shop lijst */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {data.shops.length > 0 
            ? `Alle ${categoryName} in ${data.locationName} (${data.shops.length})`
            : `${categoryName} in ${data.locationName}`
          }
        </h2>
        
        {data.shops.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">
              We zijn nog bezig met het toevoegen van {categoryName.toLowerCase()} in {data.locationName}.
            </p>
            <p className="text-gray-600 mb-6">
              Heb je een winkel? Meld je gratis aan en bereik duizenden potentiële klanten.
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

      {/* Andere categorieën - interne links */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Andere categorieën in {data.locationName}
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryNames)
            .filter(([slug]) => slug !== params.category)
            .map(([slug, name]) => (
              <Link
                key={slug}
                href={`/${slug}/${params.location}`}
                className="px-4 py-2 bg-white border rounded-full text-sm hover:border-accent hover:text-accent transition"
              >
                {name} in {data.locationName}
              </Link>
            ))}
        </div>
      </section>

      {/* FAQ sectie */}
      {data.faqs.length > 0 && (
        <section className="mb-12">
          <FAQSection faqs={data.faqs} />
        </section>
      )}

      {/* Uitgebreide SEO tekst (~400+ woorden) */}
      <section className="prose prose-lg max-w-none bg-gray-50 rounded-xl p-8 mt-12">
        <h2>Alles over {categoryName} in {data.locationName}</h2>
        
        <p>
          {data.locationName} biedt een breed scala aan mogelijkheden voor wie op zoek is naar 
          hoogwaardige {categoryName.toLowerCase()}. Of je nu een ervaren drager bent of net begint 
          met het verkennen van modest fashion, in {data.locationName} vind je winkels die aan al 
          je wensen voldoen.
        </p>

        <h3>Waarom {categoryName.toLowerCase()} kopen in {data.locationName}?</h3>
        <p>
          {data.isCountry 
            ? `${data.locationName} heeft een bloeiende modest fashion scene met winkels in steden zoals ${data.relatedCities.slice(0, 3).map(c => c.name).join(', ')}. `
            : `${data.locationName} is een populaire bestemming voor modest fashion shopping. `
          }
          De winkels in onze directory bieden een uitgebreide collectie van {keywords.slice(0, 5).join(', ')} en nog veel meer. 
          Veel winkels hebben ook een webshop, waardoor je gemakkelijk vanuit huis kunt bestellen met snelle levering.
        </p>

        <h3>Waar moet je op letten bij het kiezen van {categoryName.toLowerCase()}?</h3>
        <p>
          Bij het kiezen van de juiste {categoryName.toLowerCase()} zijn er verschillende factoren om rekening mee te houden:
        </p>
        <ul>
          <li><strong>Kwaliteit van de stof</strong> – Kies voor ademende, hoogwaardige materialen die lang meegaan en comfortabel zitten.</li>
          <li><strong>Pasvorm</strong> – Zorg dat de kleding comfortabel zit en voldoet aan jouw persoonlijke wensen voor bedekking en stijl.</li>
          <li><strong>Seizoen</strong> – Kies lichtere stoffen voor de zomer en warmere materialen voor de winter.</li>
          <li><strong>Prijs-kwaliteitverhouding</strong> – Vergelijk prijzen en lees reviews voordat je een aankoop doet.</li>
          <li><strong>Retourbeleid</strong> – Controleer altijd de retourvoorwaarden, vooral bij online aankopen.</li>
        </ul>

        <h3>Online vs. fysieke winkels in {data.locationName}</h3>
        <p>
          Zowel fysieke winkels als webshops hebben hun voordelen. In een fysieke winkel kun je de 
          producten voelen en passen voordat je koopt. Je krijgt ook persoonlijk advies van het winkelpersoneel. 
          Online winkels bieden daarentegen vaak een grotere selectie, gemakkelijke prijsvergelijking en 
          thuisbezorging. Veel winkels in {data.locationName} bieden beide opties, zodat je het beste van 
          beide werelden kunt combineren.
        </p>

        <h3>Tips voor het shoppen van {categoryName.toLowerCase()}</h3>
        <p>
          Voordat je een aankoop doet, raden we aan om altijd de beoordelingen van andere klanten te lezen. 
          Bij ModestDirectory verzamelen we eerlijke reviews van echte klanten, zodat je een weloverwogen 
          keuze kunt maken. Let ook op de verzendkosten en levertijden als je online bestelt. Sommige 
          winkels bieden gratis verzending aan vanaf een bepaald bedrag of hebben een fysieke winkel 
          waar je je bestelling kunt ophalen.
        </p>

        {data.isCountry && data.relatedCities.length > 0 && (
          <>
            <h3>{categoryName} in andere steden van {data.locationName}</h3>
            <p>
              Naast de winkels op deze pagina kun je ook uitstekende {categoryName.toLowerCase()} vinden in andere 
              steden van {data.locationName}. Elke stad heeft zijn eigen unieke winkels en specialiteiten. 
              Bekijk onze uitgebreide gidsen voor{' '}
              {data.relatedCities.slice(0, 5).map((city, index) => (
                <span key={city.id}>
                  <Link href={`/${params.category}/${city.slug}`} className="text-accent hover:underline">
                    {categoryName} in {city.name}
                  </Link>
                  {index < Math.min(4, data.relatedCities.length - 1) ? ', ' : ''}
                </span>
              ))}
              {' '}en ontdek nog meer opties bij jou in de buurt.
            </p>
          </>
        )}

        <h3>Veelgestelde vragen over {categoryName.toLowerCase()}</h3>
        <p>
          Heb je vragen over {categoryName.toLowerCase()} of over specifieke winkels? Bekijk onze{' '}
          <Link href="/faq" className="text-accent hover:underline">FAQ pagina</Link> voor antwoorden 
          op de meest gestelde vragen. Je kunt ook de reviews op de individuele winkelpagina's lezen 
          voor ervaringen van andere klanten.
        </p>
      </section>

      {/* CTA sectie */}
      <section className="text-center mt-12 p-8 bg-accent/5 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Heb je een {categoryName.toLowerCase().replace(' winkels', '').replace(' shops', '')} winkel in {data.locationName}?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Meld je winkel gratis aan bij ModestDirectory en bereik duizenden potentiële klanten 
          die op zoek zijn naar {categoryName.toLowerCase()} in {data.locationName} en omgeving.
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
