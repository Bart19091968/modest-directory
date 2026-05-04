export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db'
import ShopCard from '@/components/ShopCard'
import Banner from '@/components/Banner'
import ShopSearchBar from '@/components/ShopSearchBar'

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

async function getCities() {
  const rows = await prisma.shop.findMany({
    where: { status: 'APPROVED', city: { not: null } },
    select: { city: true, citySlug: true, country: true },
    distinct: ['citySlug'],
    orderBy: { city: 'asc' },
  })
  return {
    citiesBE: rows.filter(r => r.country === 'BE' && r.city && r.citySlug).map(r => ({ name: r.city!, slug: r.citySlug! })),
    citiesNL: rows.filter(r => r.country === 'NL' && r.city && r.citySlug).map(r => ({ name: r.city!, slug: r.citySlug! })),
  }
}

export default async function HomePage() {
  const [shops, sponsors, heroImageUrl, cities] = await Promise.all([
    getFeaturedShops(),
    getSponsors(),
    getHeroImageUrl(),
    getCities(),
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
            <ShopSearchBar citiesBE={cities.citiesBE} citiesNL={cities.citiesNL} centered />
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


      {/* Editorial intro */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-10 h-0.5 bg-accent mx-auto mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed mb-5">
            Tussen ontdekken en kiezen zit vaak meer dan alleen scrollen. Wie op zoek is naar{' '}
            <em>modest fashion</em>, zoekt naar stijl die klopt — ingetogen, verfijnd en moeiteloos draagbaar.{' '}
            <strong>ModestDirectory.com</strong> brengt precies dat samen in één overzichtelijk platform.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-5">
            Van hijabmerken tot moderne modest wear labels: je vindt hier een zorgvuldig geselecteerde collectie van winkels die uitblinken in kwaliteit, esthetiek en tijdloze elegantie. Geen eindeloze lijsten, maar een gerichte selectie die aansluit bij trends zoals minimalisme en ingetogen luxe.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Of je nu inspiratie zoekt of gericht wilt shoppen, ModestDirectory.com helpt je ontdekken — zonder ruis, met focus.
          </p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-8" />
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

    </>
  )
}
