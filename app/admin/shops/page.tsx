import prisma from '@/lib/db'
import Link from 'next/link'
import AdminShopList from '@/components/AdminShopList'

export const dynamic = 'force-dynamic'

type SearchParams = {
  status?: string
}

async function getShops(status?: string) {
  const where = status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)
    ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }
    : {}

  return prisma.shop.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { reviews: true } },
    },
  })
}

export default async function AdminShopsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const shops = await getShops(params.status)

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Winkels beheren</h1>
        
        <div className="flex gap-2">
          <Link 
            href="/admin/shops/import"
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent-dark transition"
          >
            + CSV Import
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link 
          href="/admin/shops"
          className={`px-4 py-2 rounded-lg text-sm ${!params.status ? 'bg-accent text-white' : 'bg-white text-gray-700 border'}`}
        >
          Alle
        </Link>
        <Link 
          href="/admin/shops?status=PENDING"
          className={`px-4 py-2 rounded-lg text-sm ${params.status === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Wachtend
        </Link>
        <Link 
          href="/admin/shops?status=APPROVED"
          className={`px-4 py-2 rounded-lg text-sm ${params.status === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Goedgekeurd
        </Link>
        <Link 
          href="/admin/shops?status=REJECTED"
          className={`px-4 py-2 rounded-lg text-sm ${params.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border'}`}
        >
          Afgewezen
        </Link>
      </div>

      <AdminShopList shops={shops} />
    </div>
  )
}
