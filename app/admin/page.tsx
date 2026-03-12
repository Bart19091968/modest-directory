import Link from 'next/link'
import prisma from '@/lib/db'

async function getStats() {
  const [
    totalShops,
    pendingShops,
    approvedShops,
    totalReviews,
    pendingReviews,
  ] = await Promise.all([
    prisma.shop.count(),
    prisma.shop.count({ where: { status: 'PENDING' } }),
    prisma.shop.count({ where: { status: 'APPROVED' } }),
    prisma.review.count(),
    prisma.review.count({ where: { isVerified: false } }),
  ])

  return { totalShops, pendingShops, approvedShops, totalReviews, pendingReviews }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-accent">{stats.approvedShops}</div>
          <div className="text-gray-600">Actieve winkels</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingShops}</div>
          <div className="text-gray-600">Wachtende aanvragen</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-blue-600">{stats.totalReviews}</div>
          <div className="text-gray-600">Totaal reviews</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</div>
          <div className="text-gray-600">Onbevestigde reviews</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/shops?status=PENDING"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Winkelaanvragen beoordelen</h3>
          <p className="text-gray-600 text-sm">
            {stats.pendingShops} winkels wachten op goedkeuring
          </p>
        </Link>

        <Link 
          href="/admin/reviews"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Reviews beheren</h3>
          <p className="text-gray-600 text-sm">
            Bekijk en beheer alle reviews
          </p>
        </Link>
      </div>
    </div>
  )
}
