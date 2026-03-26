import prisma from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [shopCount, pendingShops, reviewCount, pendingReviews, blogCount] = await Promise.all([
    prisma.shop.count({ where: { status: 'APPROVED' } }),
    prisma.shop.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { isVerified: true } }),
    prisma.review.count({ where: { isVerified: false } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ])

  return { shopCount, pendingShops, reviewCount, pendingReviews, blogCount }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Goedgekeurde winkels</p>
          <p className="text-3xl font-bold text-gray-900">{stats.shopCount}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Wachtende winkels</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingShops}</p>
          {stats.pendingShops > 0 && (
            <Link href="/admin/shops?status=PENDING" className="text-sm text-accent hover:underline">
              Bekijken →
            </Link>
          )}
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Geverifieerde reviews</p>
          <p className="text-3xl font-bold text-gray-900">{stats.reviewCount}</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Blog artikelen</p>
          <p className="text-3xl font-bold text-gray-900">{stats.blogCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle acties</h2>
          <div className="space-y-3">
            <Link href="/admin/shops?status=PENDING" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📋 Winkels beoordelen
            </Link>
            <Link href="/admin/blog/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              ✏️ Nieuw blog artikel
            </Link>
            <Link href="/admin/shops/import" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📁 Winkels importeren (CSV)
            </Link>
            <Link href="/admin/ads" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              💰 Advertenties beheren
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Pagina's</h2>
          <p className="text-sm text-gray-600 mb-4">
            Je site genereert automatisch SEO pagina's voor:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Hijab shops per stad en land</li>
            <li>✓ Abaya winkels per stad en land</li>
            <li>✓ Modest fashion per stad en land</li>
            <li>✓ Islamitische kleding per stad en land</li>
            <li>✓ Blog artikelen met schema markup</li>
            <li>✓ FAQ pagina met structured data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
