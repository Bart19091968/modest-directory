export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db'
import ShopCard from '@/components/ShopCard'
import Banner from '@/components/Banner'
import SearchFilter from '@/components/SearchFilter'

export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
  description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België. Lees reviews van echte klanten, vergelijk scores en ontdek islamitische kledingwinkels bij jou in de buurt.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België. Lees reviews van echte klanten.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
      },
    ],
  },
}

async function getFeaturedShops() {
  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      OR: [
        { isFeatured: true },
        { subscriptionTier: { in: ['SILVER', 'GOLD'] } },
      ],
    },
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
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 12,
  })
  const TIER_ORDER: Record<string, number> = { GOLD: 0, SILVER: 1, BRONZE: 2 }
  return [...shops].sort((a, b) =>
    (TIER_ORDER[a.subscriptionTier ?? ''] ?? 3) - (TIER_ORDER[b.subscriptionTier ?? ''] ?? 3)
  ).slice(0, 6)
}

async function getSponsors() {
  return prisma.sponsor.findMany({
    where: {
      isActive: true,
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } },
      ],
    },
  })
}

async function getHeroImageUrl(): Promise<string | null> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'heroImageUrl' } })
    return setting?.value || null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [shops, sponsors, heroImageUrl] = await Promise.all([
    getFeaturedShops(),
    getSponsors(),
    getHeroImageUrl(),
  ])

  const headerSponsors = sponsors.filter(s => s.position === 'HEADER')
  const sidebarSponsors = sponsors.filter(s => s.position === 'SIDEBAR')

  return (
    <>
      {/* Hero Section */}
      <section
        className={`relative py-20 ${!heroImageUrl ? 'bg-gradient-to-br from-primary-50 to-primary-100' : ''}`}
        style={heroImageUrl ? {
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {heroImageUrl && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {headerSponsors.length > 0 && (
            <div className="mb-8">
              {headerSponsors.map(sponsor => (
                <Banner key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          )}

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${heroImageUrl ? 'text-white' : 'text-gray-900'}`}>
            Islamitische Kledingwinkels
            <span className={`block ${heroImageUrl ? 'text-white/90' : 'text-accent'}`}>in Nederland & België</span>
          </h1>

          <p className={`text-xl mb-8 max-w-2xl mx-auto ${heroImageUrl ? 'text-white/90' : 'text-gray-600'}`}>
            Ontdek de beste hijab shops, abaya winkels en modest fashion.
            Lees reviews van echte klanten en vind jouw perfecte winkel.
          </p>

          {/* Search */}
          <div className="mb-8 max-w-2xl mx-auto">
            <SearchFilter />
          </div>

          <div className="flex justify-center">
            <Link href="/shops" className="btn-primary text-lg">
              Bekijk alle winkels
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Uitgelichte winkels</h2>
                <Link href="/shops" className="text-accent hover:underline">
                  Bekijk alle →
                </Link>
              </div>
              
              {shops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shops.map(shop => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 mb-4">Nog geen winkels beschikbaar.</p>
                  <Link href="/aanmelden" className="text-accent hover:underline">
                    Meld je winkel aan →
                  </Link>
                </div>
              )}
            </div>
            
            {/* Sidebar with sponsors */}
            {sidebarSponsors.length > 0 && (
              <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-24 space-y-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Advertenties</p>
                  {sidebarSponsors.map(sponsor => (
                    <Banner key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Hoe werkt het?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Zoek</h3>
              <p className="text-gray-600">Vind winkels in jouw regio of filter op type (webshop, fysieke winkel).</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Vergelijk</h3>
              <p className="text-gray-600">Lees reviews van andere klanten en vergelijk scores.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Review</h3>
              <p className="text-gray-600">Deel jouw ervaring en help anderen de beste winkel te vinden.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial content: Modest fashion in NL & BE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Modest fashion in Nederland en België
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              Modest fashion — ook wel bescheiden mode of islamitische mode genoemd — is een stijl waarbij kleding het lichaam bedekt op een manier die aansluit bij religieuze of persoonlijke waarden. In Nederland en België groeit de interesse in modest fashion gestaag, zowel onder moslima's als onder vrouwen die gewoon houden van elegante, stijlvolle en niet-onthullende kleding.
            </p>
            <p>
              De modest fashion markt in de Benelux omvat een breed scala aan producten: van <strong>hijabs en hoofddoeken</strong> in tientallen stijlen en materialen tot <strong>abayas, jilbabs en gebedsjurken</strong>, en van <strong>modest swimwear</strong> tot alledaagse <strong>lange jurken, maxi rokken en tuniekblouses</strong>. Winkels variëren van gespecialiseerde hijab boutiques tot volledige islamitische kledingwinkels met een breed aanbod.
            </p>
            <p>
              Steden als <strong>Amsterdam, Rotterdam, Den Haag, Utrecht</strong> en in België <strong>Brussel, Antwerpen en Gent</strong> hebben een bloeiende modest fashion scene met zowel fysieke winkels als online webshops die door heel Nederland en België leveren. Dankzij de groeiende vraag zijn er ook steeds meer Nederlandse en Belgische ontwerpers die eigen modest fashion collecties lanceren.
            </p>
            <p>
              ModestDirectory brengt al deze winkels samen op één overzichtelijk platform. Of je nu op zoek bent naar een winkel bij jou in de buurt, een betrouwbare webshop, of wil vergelijken op basis van klantreviews — hier vind je alle informatie die je nodig hebt om de beste keuze te maken.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Hijabs & Hoofddoeken</h3>
              <p className="text-gray-600 text-sm">Jersey hijabs, chiffon sjaals, instant hijabs, underscarfs en accessoires. Vind de stijl die bij jou past.</p>
              <Link href="/hijab-shops/nederland" className="text-accent text-sm hover:underline mt-3 block">Bekijk hijab shops →</Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Abayas & Jilbabs</h3>
              <p className="text-gray-600 text-sm">Open abayas, gesloten abayas, kimono abayas en jilbabs in alle kleuren en maten. Voor elke gelegenheid.</p>
              <Link href="/abaya-shops/nederland" className="text-accent text-sm hover:underline mt-3 block">Bekijk abaya winkels →</Link>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Modest Fashion</h3>
              <p className="text-gray-600 text-sm">Lange jurken, maxi rokken, tuniekblouses en meer. Stijlvol en bescheiden voor elke dag.</p>
              <Link href="/modest-fashion/nederland" className="text-accent text-sm hover:underline mt-3 block">Bekijk modest fashion →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why ModestDirectory */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Waarom ModestDirectory?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Voor consumenten</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Honderden winkels overzichtelijk op één plek — bespaar tijd met zoeken</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Geverifieerde klantreviews zodat je weet wat je kunt verwachten</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Filter op stad, land, type winkel (fysiek of webshop) en categorie</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Openingstijden, contactgegevens en social media op één pagina</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Gratis te gebruiken — altijd en overal</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Voor winkeliers</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Gratis basisvermelding — direct zichtbaar voor duizenden bezoekers</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Betaalde pakketten voor extra zichtbaarheid: logo, foto's, uitgebreide beschrijving</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Reviews ontvangen van echte klanten en je reputatie opbouwen</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>SEO-geoptimaliseerde pagina's die goed vindbaar zijn in Google</span></li>
                <li className="flex gap-2"><span className="text-accent font-bold mt-0.5">✓</span><span>Eenvoudig aanmelden — binnen enkele minuten online</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-accent hover:underline font-medium">
              Lees meer tips op ons blog over modest fashion →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Heb je een winkel?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Vind je je winkel niet terug? Meld hem dan gratis aan of kies voor één van onze betalende opties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gratis-aanmelden" className="inline-block bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Gratis aanmelden
            </Link>
            <Link href="/aanmelden" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Kies een pakket
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
