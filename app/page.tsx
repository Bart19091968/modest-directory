export const dynamic = 'force-dynamic'
import Link from 'next/link'
import prisma from '@/lib/db'
import ShopCard from '@/components/ShopCard'
import Banner from '@/components/Banner'

export const revalidate = 3600 // Revalidate every hour

async function getFeaturedShops() {
  return prisma.shop.findMany({
    where: { status: 'APPROVED' },
    include: {
      reviews: {
        where: { isVerified: true },
        select: { score: true },
      },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 6,
  })
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

async function getStats() {
  const [shopCount, reviewCount] = await Promise.all([
    prisma.shop.count({ where: { status: 'APPROVED' } }),
    prisma.review.count({ where: { isVerified: true } }),
  ])
  return { shopCount, reviewCount }
}

export default async function HomePage() {
  const [shops, sponsors, stats] = await Promise.all([
    getFeaturedShops(),
    getSponsors(),
    getStats(),
  ])

  const headerSponsors = sponsors.filter(s => s.position === 'HEADER')
  const sidebarSponsors = sponsors.filter(s => s.position === 'SIDEBAR')

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {headerSponsors.length > 0 && (
            <div className="mb-8">
              {headerSponsors.map(sponsor => (
                <Banner key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Islamitische Kledingwinkels
            <span className="block text-accent">in Nederland & België</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ontdek de beste hijab shops, abaya winkels en modest fashion. 
            Lees reviews van echte klanten en vind jouw perfecte winkel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shops" className="btn-primary text-lg">
              Bekijk alle winkels
            </Link>
            <Link href="/aanmelden" className="btn-secondary text-lg">
              Winkel aanmelden
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-12 flex justify-center gap-12">
            <div>
              <div className="text-3xl font-bold text-accent">{stats.shopCount}</div>
              <div className="text-gray-600">Winkels</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{stats.reviewCount}</div>
              <div className="text-gray-600">Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">2</div>
              <div className="text-gray-600">Landen</div>
            </div>
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

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Heb je een winkel?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Meld je winkel gratis aan en bereik duizenden potentiële klanten die op zoek zijn naar islamitische kleding.
          </p>
          <Link href="/aanmelden" className="inline-block bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Gratis aanmelden
          </Link>
        </div>
      </section>
    </>
  )
}
