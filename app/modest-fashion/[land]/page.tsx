import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'

export const dynamic = 'force-dynamic'

type Params = {
  land: string
}

type PageContent = {
  h1: string
  seoTitle: string
  metaDesc: string
  intro: string
  seoBlock: string
}

const pageContent: Record<string, PageContent> = {
  // ── Country pages (section 4) ────────────────────────────────────────
  nederland: {
    h1: 'Modest fashion winkels in Nederland',
    seoTitle: "Modest fashion winkels in Nederland | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Nederland. Vergelijk webshops en fysieke winkels voor hijabs, hoofddoeken, abaya's en islamitische kleding.",
    intro: "Welkom bij ModestDirectory, je gids voor modest fashion winkels in Nederland. Op deze pagina vind je fysieke winkels en webshops voor hijabs, hoofddoeken, abaya's, khimars, jilbabs en islamitische kleding. Van Amsterdam en Rotterdam tot Den Haag, Utrecht en Eindhoven: hier ontdek je winkels die bescheiden mode op hun eigen manier invullen.\n\nNederland heeft een brede modest-fashioncultuur, met webshops die snel leveren en fysieke boutiques waar stof, pasvorm en stylingadvies net zo belangrijk zijn als de collectie zelf. Gebruik de filters om winkels te vergelijken op stad, categorie en type winkel.",
    seoBlock: "Modest fashion in Nederland beweegt tussen praktisch en uitgesproken. Je vindt er dagelijkse jersey hijabs, luchtige chiffon hoofddoeken, eenvoudige abaya's, feestelijke Eid-outfits en moderne silhouetten die passen bij een garderobe die bedekking en stijl samenbrengt.\n\nAmsterdam heeft een sterke mix van boutiques, webshops en grotere modest-fashionzaken. Rotterdam valt op door winkels rond levendige winkelstraten en een aanbod dat vaak net wat stedelijker en directer aanvoelt. Den Haag, Utrecht en Eindhoven voegen daar hun eigen accenten aan toe, van islamitische boekhandels met kledingafdelingen tot gespecialiseerde abaya- en hijabshops.\n\nDeze pagina is bedoeld als vertrekpunt: niet om eindeloos te scrollen, maar om sneller winkels te vinden die aansluiten bij wat je zoekt.",
  },
  belgie: {
    h1: 'Modest fashion winkels in België',
    seoTitle: "Modest fashion winkels in België | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in België. Vergelijk fysieke winkels en webshops voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Welkom bij ModestDirectory, je gids voor modest fashion winkels in België. Hier vind je webshops en fysieke winkels voor hijabs, hoofddoeken, abaya's, khimars, jilbabs en islamitische kleding in onder meer Antwerpen, Brussel, Gent, Luik en Charleroi.\n\nBelgië heeft een modest-fashionlandschap met verschillende gezichten. In Antwerpen speelt modegevoel een duidelijke rol, Brussel brengt internationale invloeden samen, en ook buiten de grote steden groeit het aanbod aan webshops en gespecialiseerde winkels. Gebruik deze pagina om winkels te vergelijken op locatie, categorie en type winkel.",
    seoBlock: "Modest fashion in België voelt vaak persoonlijk en zorgvuldig. Sommige winkels richten zich op dagelijkse basics zoals jersey hijabs en onderkapjes, andere kiezen voor elegante abaya's, kaftans, feestelijke jurken of complete outfits voor Ramadan en Eid.\n\nAntwerpen is interessant voor wie modest fashion met een modebewuste blik zoekt. Brussel heeft een stedelijk en internationaal aanbod, met winkels die vaak meerdere stijlen en gemeenschappen bedienen. Gent, Luik en Charleroi maken het landschap breder: soms via fysieke winkels, soms via webshops die in heel België leveren.\n\nDeze gids helpt bezoekers om sneller een eerste selectie te maken, zonder dat elke winkel hetzelfde hoeft te zijn.",
  },

  // ── City pages (section 6) ───────────────────────────────────────────
  amsterdam: {
    h1: 'Modest fashion winkels in Amsterdam',
    seoTitle: "Modest fashion winkels in Amsterdam | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Amsterdam. Vergelijk webshops en fysieke winkels voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Amsterdam heeft een van de meest gevarieerde modest-fashionaanbiedingen van Nederland. Van Osdorpplein tot De Pijp en Amsterdam-West vind je winkels en webshops met hijabs, abaya's, hoofddoeken, kaftans, islamitische boeken en kleding voor verschillende momenten van de week.\n\nGebruik deze pagina om modest fashion winkels in Amsterdam te vergelijken. Zoek je een fysieke winkel waar je stoffen kunt voelen, of juist een webshop met snelle levering? Hier begin je gericht.",
    seoBlock: "Wat Amsterdam interessant maakt, is de mix. Sommige winkels voelen als een buurtadres waar klanten terugkomen voor advies en vertrouwde basics. Andere zaken hebben juist een uitgesproken merkgevoel, met collecties die dichter bij hedendaagse fashion liggen.",
  },
  rotterdam: {
    h1: 'Modest fashion winkels in Rotterdam',
    seoTitle: "Modest fashion winkels in Rotterdam | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Rotterdam. Vergelijk fysieke winkels en webshops voor hijabs, abaya's en islamitische kleding.",
    intro: "Rotterdam heeft een directe, stedelijke modest-fashionenergie. Rond bekende winkelstraten en online boutiques vind je hijabs, abaya's, dameskleding, islamitische producten en moderne bescheiden mode met een praktische insteek.\n\nGebruik deze pagina om modest fashion winkels in Rotterdam te vergelijken op type winkel, categorie en locatie.",
    seoBlock: "Rotterdam is interessant voor bezoekers die graag fysiek winkelen, maar ook voor wie online wil oriënteren. Het aanbod loopt van toegankelijke basics tot winkels met een duidelijke eigen stijl.",
  },
  'den-haag': {
    h1: 'Modest fashion winkels in Den Haag',
    seoTitle: "Modest fashion winkels in Den Haag | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Den Haag. Vergelijk boutiques, webshops en fysieke winkels voor hijabs, abaya's en islamitische kleding.",
    intro: "Den Haag heeft een herkenbare plek binnen de Nederlandse modest fashion, met winkels die variëren van islamitische boekhandels met kleding tot boutiques voor abaya's, hijabs en damesmode. De stad voelt minder gehaast dan Amsterdam, maar heeft juist daardoor veel ruimte voor persoonlijke winkeladressen.\n\nGebruik deze pagina om modest fashion winkels in Den Haag te vergelijken en snel door te klikken naar de categorie die je zoekt.",
    seoBlock: "Voor veel bezoekers draait winkelen in Den Haag om vertrouwen: weten waar je terechtkunt voor advies, pasvorm en een assortiment dat past bij dagelijks gebruik of een speciale gelegenheid.",
  },
  utrecht: {
    h1: 'Modest fashion winkels in Utrecht',
    seoTitle: "Modest fashion winkels in Utrecht | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Utrecht. Vergelijk winkels en webshops voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Utrecht is overzichtelijker dan de grote modest-fashionsteden, maar juist daardoor prettig om gericht te zoeken. Je vindt er winkels en webshops met hijabs, abaya's, khimars, accessoires en islamitische producten.\n\nGebruik deze pagina als vertrekpunt voor modest fashion in Utrecht en vergelijk winkels op categorie en type winkel.",
    seoBlock: "Utrecht trekt bezoekers uit de stad zelf én uit omliggende plaatsen. Voor wie niet eindeloos wil zoeken, is een heldere vergelijking van fysieke winkels en webshops belangrijk.",
  },
  eindhoven: {
    h1: 'Modest fashion winkels in Eindhoven',
    seoTitle: "Modest fashion winkels in Eindhoven | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Eindhoven. Vergelijk fysieke winkels en webshops voor hijabs, abaya's en islamitische kleding.",
    intro: "Eindhoven heeft een compact maar relevant aanbod voor wie modest fashion zoekt in Zuid-Nederland. Denk aan hijabs, abaya's, hoofddoeken, islamitische boeken, accessoires en webshops die in de regio leveren.\n\nGebruik deze pagina om modest fashion winkels in Eindhoven te vergelijken en sneller te zien welke winkels fysiek bereikbaar zijn.",
    seoBlock: "Voor bezoekers uit Eindhoven en omgeving is lokale vindbaarheid belangrijk. Niet iedereen wil bestellen zonder stof of pasvorm te zien. Tegelijk maken webshops het aanbod ruimer dan de stad alleen.",
  },
  antwerpen: {
    h1: 'Modest fashion winkels in Antwerpen',
    seoTitle: "Modest fashion winkels in Antwerpen | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Antwerpen. Vergelijk fysieke winkels en webshops voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Antwerpen heeft mode in het bloed, en dat zie je ook in het modest-fashionaanbod. De stad combineert boetiekgevoel, internationale invloeden en lokale ondernemers met een aanbod van hijabs, abaya's, kaftans, hoofddoeken en islamitische kleding.\n\nGebruik deze pagina om modest fashion winkels in Antwerpen te vergelijken op locatie, categorie en type winkel.",
    seoBlock: "Antwerpen is een logische bestemming voor wie modest fashion niet alleen praktisch, maar ook stijlbewust benadert. Sommige winkels richten zich op dagelijkse hijabs en basics; andere hebben een uitgesprokener aanbod met abaya's, feestelijke jurken of accessoires.",
  },
  brussel: {
    h1: 'Modest fashion winkels in Brussel',
    seoTitle: "Modest fashion winkels in Brussel | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Brussel. Vergelijk fysieke winkels en webshops voor hijabs, abaya's en islamitische kleding.",
    intro: "Brussel brengt verschillende stijlen, talen en gemeenschappen samen. Dat maakt de stad interessant voor wie modest fashion zoekt: van islamitische winkels in drukke winkelbuurten tot webshops die klanten in de hele regio bedienen.\n\nGebruik deze pagina om modest fashion winkels in Brussel te vergelijken en gericht verder te zoeken binnen hijabs, abaya's of islamitische kleding.",
    seoBlock: "In Brussel is modest fashion vaak praktisch en veelzijdig. Je vindt er winkels waar kleding samenkomt met boeken, geschenken of dagelijkse producten, maar ook adressen waar hijabs en abaya's centraal staan.",
  },
  gent: {
    h1: 'Modest fashion winkels in Gent',
    seoTitle: "Modest fashion winkels in Gent | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Gent. Vergelijk winkels en webshops voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Gent heeft een kleiner, maar groeiend modest-fashionaanbod. Voor bezoekers die hijabs, abaya's, hoofddoeken of islamitische kleding zoeken, is het handig om fysieke winkels en webshops op één plek te vergelijken.\n\nGebruik deze pagina als vertrekpunt voor modest fashion in Gent en omgeving.",
    seoBlock: "Niet elke modest-fashionzoektocht begint in een grote winkelstraat. Soms gaat het om een lokale webshop, een gespecialiseerd adres of een winkel die een breder islamitisch assortiment combineert met kleding.",
  },
  charleroi: {
    h1: 'Modest fashion winkels in Charleroi',
    seoTitle: "Modest fashion winkels in Charleroi | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Charleroi. Vergelijk webshops en fysieke winkels voor hijabs, abaya's en islamitische kleding.",
    intro: "Charleroi is geen klassieke modest-fashionhoofdstad, maar juist daarom is een overzicht nuttig. Deze pagina helpt bezoekers om winkels en webshops te vinden voor hijabs, abaya's, hoofddoeken en islamitische kleding in Charleroi en omgeving.\n\nGebruik de filters om snel te zien welke winkels lokaal relevant zijn en welke webshops in België leveren.",
    seoBlock: "Voor kleinere steden is online vindbaarheid extra belangrijk. Wie zoekt naar modest fashion in Charleroi wil vaak snel weten of er een lokale optie is, of dat een Belgische webshop de betere keuze is.",
  },
  luik: {
    h1: 'Modest fashion winkels in Luik',
    seoTitle: "Modest fashion winkels in Luik | Hijabs, abaya's & meer",
    metaDesc: "Vind modest fashion winkels in Luik. Vergelijk fysieke winkels en webshops voor hijabs, abaya's, hoofddoeken en islamitische kleding.",
    intro: "Luik heeft een eigen stedelijk karakter en bedient ook bezoekers uit de bredere regio. Voor modest fashion betekent dat: snel kunnen zien welke winkels, webshops en categorieën relevant zijn voor hijabs, abaya's, hoofddoeken en islamitische kleding.\n\nGebruik deze pagina om winkels in Luik en webshops met levering in België te vergelijken.",
    seoBlock: "De kracht van een lokale pagina voor Luik zit in duidelijkheid. Niet elke bezoeker zoekt een grote winkelervaring; vaak gaat het om een betrouwbare plek voor een specifieke hijab, abaya of kledingstuk.",
  },
}

const nlCities = [
  { slug: 'amsterdam', name: 'Amsterdam' },
  { slug: 'rotterdam', name: 'Rotterdam' },
  { slug: 'den-haag', name: 'Den Haag' },
  { slug: 'utrecht', name: 'Utrecht' },
  { slug: 'eindhoven', name: 'Eindhoven' },
]
const beCities = [
  { slug: 'antwerpen', name: 'Antwerpen' },
  { slug: 'brussel', name: 'Brussel' },
  { slug: 'gent', name: 'Gent' },
  { slug: 'charleroi', name: 'Charleroi' },
  { slug: 'luik', name: 'Luik' },
]

function getInternalLinks(
  land: string,
  isCountry: boolean,
  countrySlug: string,
  locationName: string,
): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = []

  if (isCountry) {
    // Section 8.1 on country pages: link to category pages for each city
    const cities = land === 'nederland' ? nlCities : beCities
    links.push({ href: `/hijab-shops/${land}`, label: `Hijab winkels in ${locationName}` })
    links.push({ href: `/abaya-shops/${land}`, label: `Abaya winkels in ${locationName}` })
    links.push({ href: `/islamitische-kleding/${land}`, label: `Islamitische kleding in ${locationName}` })
    for (const city of cities) {
      links.push({ href: `/modest-fashion/${city.slug}`, label: `Modest fashion in ${city.name}` })
    }
  } else {
    // Section 8.1 on city pages: link to category pages for this city + country page
    links.push({ href: `/hijab-shops/${land}`, label: `Hijab winkels in ${locationName}` })
    links.push({ href: `/abaya-shops/${land}`, label: `Abaya winkels in ${locationName}` })
    links.push({ href: `/islamitische-kleding/${land}`, label: `Islamitische kleding in ${locationName}` })
    links.push({ href: `/modest-fashion/${countrySlug}`, label: `Modest fashion winkels in ${countrySlug === 'nederland' ? 'Nederland' : 'België'}` })
  }

  return links
}

async function getLocationData(landSlug: string) {
  const country = await prisma.country.findUnique({ where: { slug: landSlug } })

  if (country) {
    const shops = await prisma.shop.findMany({
      where: { status: 'APPROVED', country: country.code },
      orderBy: [{ isFeatured: 'desc' }, { subscriptionTier: 'asc' }, { createdAt: 'desc' }],
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

    const cities = await prisma.city.findMany({
      where: { countryId: country.id },
      orderBy: { name: 'asc' },
    })

    return { isCountry: true, location: country, shops, cities }
  }

  const city = await prisma.city.findUnique({
    where: { slug: landSlug },
    include: { country: true },
  })

  if (city) {
    const shops = await prisma.shop.findMany({
      where: { status: 'APPROVED', country: city.country.code, citySlug: landSlug },
      orderBy: [{ isFeatured: 'desc' }, { subscriptionTier: 'asc' }, { createdAt: 'desc' }],
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

    return { isCountry: false, location: city, shops }
  }

  return null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getLocationData(params.land)
  if (!data) return { title: 'Niet gevonden' }

  const content = pageContent[params.land]
  const title = content?.seoTitle ?? `Modest fashion winkels in ${data.location.name}`
  const description = content?.metaDesc ?? `Vind modest fashion winkels in ${data.location.name}.`

  return {
    title,
    description,
    alternates: { canonical: `/modest-fashion/${data.location.slug}` },
    openGraph: { title, description, type: 'website' },
    ...(!data.isCountry && data.shops.length < 2 && {
      robots: { index: false, follow: true },
    }),
  }
}

function generateBreadcrumbSchema(
  land: string,
  locationName: string,
  isCountry: boolean,
  countrySlug?: string,
  countryName?: string,
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Modest Fashion', item: `${siteUrl}/modest-fashion` },
  ]
  if (!isCountry && countryName && countrySlug) {
    items.push({ '@type': 'ListItem', position: 3, name: countryName, item: `${siteUrl}/modest-fashion/${countrySlug}` })
    items.push({ '@type': 'ListItem', position: 4, name: locationName, item: `${siteUrl}/modest-fashion/${land}` })
  } else {
    items.push({ '@type': 'ListItem', position: 3, name: locationName, item: `${siteUrl}/modest-fashion/${land}` })
  }
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items }
}

function generateItemListSchema(shops: any[], locationName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Modest fashion winkels in ${locationName}`,
    itemListElement: shops.slice(0, 10).map((shop, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ClothingStore',
        name: shop.name,
        description: shop.shortDescription,
        url: `${siteUrl}/shops/${shop.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: shop.city,
          addressCountry: shop.country,
        },
      },
    })),
  }
}

export default async function LocationPage({ params }: { params: Params }) {
  const data = await getLocationData(params.land)
  if (!data) notFound()

  const { location, shops, isCountry } = data
  const content = pageContent[params.land]
  const h1 = content?.h1 ?? `Modest fashion winkels in ${location.name}`
  const introParagraphs = content?.intro?.split('\n\n') ?? []
  const seoBlockParagraphs = content?.seoBlock?.split('\n\n') ?? []
  const countrySlug = isCountry ? params.land : (location as any).country?.slug ?? ''
  const countryName = isCountry ? undefined : (location as any).country?.name
  const internalLinks = getInternalLinks(params.land, isCountry, countrySlug, location.name)

  const breadcrumbSchema = generateBreadcrumbSchema(
    params.land,
    location.name,
    isCountry,
    isCountry ? undefined : countrySlug,
    isCountry ? undefined : countryName,
  )
  const itemListSchema = shops.length > 0 ? generateItemListSchema(shops, location.name) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/modest-fashion" className="hover:text-accent">Modest Fashion</Link>
            {!isCountry && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/modest-fashion/${(data as any).location.country.slug}`} className="hover:text-accent">
                  {(data as any).location.country.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span>{location.name}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">{h1}</h1>
          <p className="text-lg text-gray-600 mt-2">{shops.length} winkels beschikbaar</p>
        </div>
      </div>

      {/* Intro */}
      {introParagraphs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow">
            {introParagraphs.map((p, i) => (
              <p key={i} className={`text-gray-700 leading-relaxed${i < introParagraphs.length - 1 ? ' mb-4' : ''}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Cities (country pages only) */}
      {isCountry && (data as any).cities?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modest fashion per stad in {location.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(data as any).cities.map((city: any) => (
              <Link
                key={city.id}
                href={`/modest-fashion/${city.slug}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900">{city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Shops */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {shops.length > 0 ? `Alle modest fashion winkels in ${location.name} (${shops.length})` : `Modest fashion winkels in ${location.name}`}
        </h2>
        {shops.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            <p className="mb-4">We zijn nog bezig met het toevoegen van winkels in {location.name}.</p>
            <p className="mb-6">Heb je een winkel? Meld je gratis aan en bereik duizenden potentiële klanten.</p>
            <Link href="/aanmelden" className="btn-primary">Winkel aanmelden</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>

      {/* SEO block */}
      {seoBlockParagraphs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modest fashion in {location.name}</h2>
            {seoBlockParagraphs.map((p, i) => (
              <p key={i} className={`text-gray-700 leading-relaxed${i < seoBlockParagraphs.length - 1 ? ' mb-4' : ''}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Internal links */}
      {internalLinks.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Meer winkels ontdekken</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {internalLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Heb je een winkel in {location.name}?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Meld je winkel aan bij ModestDirectory en bereik duizenden potentiële klanten die zoeken naar modest fashion in {location.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/aanmelden" className="btn-primary">Winkel aanmelden</Link>
            <Link href="/shops" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition bg-white/50">
              Alle winkels bekijken
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
