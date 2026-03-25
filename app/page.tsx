import Link from 'next/link'
import prisma from '@/lib/db'
import ShopCard from '@/components/ShopCard'
import SearchFilter from '@/components/SearchFilter'
import AdUnit from '@/components/AdUnit'

export const dynamic = 'force-dynamic'

async function getFeaturedShops() {
  return prisma.shop.findMany({
    where: { status: 'APPROVED', isFeatured: true },
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
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
    take: 6,
  })
}

async function getRecentShops() {
  return prisma.shop.findMany({
    where: { status: 'APPROVED' },
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
      reviews: { where: { isVerified: true }, select: { score: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export default async function HomePage() {
  const [featuredShops, recentShops, categories] = await Promise.all([
    getFeaturedShops(),
    getRecentShops(),
    getCategories(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 via-white to-accent/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Vind de beste <span className="text-accent">hijab shops</span> en modest fashion
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ontdek islamitische kledingwinkels in Nederland en België. 
              Lees reviews, vergelijk scores en vind jouw perfecte winkel.
            </p>
            
            <SearchFilter />
          </div>
        </div>
      </section>

      {/* Ad Unit */}
      <AdUnit slot="homepage-header" className="max-w-7xl mx-auto px-4 py-4" />

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Blader op categorie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/${category.slug}/nederland`}
                className="card p-6 text-center hover:border-accent transition-colors"
              >
                <span className="text-3xl mb-2 block">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.namePlural}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      {featuredShops.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                ⭐ Uitgelichte winkels
              </h2>
              <Link href="/shops" className="text-accent hover:text-accent-dark">
                Bekijk alle →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Shops */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Nieuw toegevoegd
            </h2>
            <Link href="/shops" className="text-accent hover:text-accent-dark">
              Bekijk alle →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentShops.map(shop => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Heb je een modest fashion winkel?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Meld je winkel aan voor slechts €100 voor 3 maanden en bereik duizenden potentiële klanten in Nederland en België.
          </p>
          <Link href="/aanmelden" className="inline-block bg-white text-accent px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
            Winkel aanmelden →
          </Link>
        </div>
      </section>
    </div>
  )
}
