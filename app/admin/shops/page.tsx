import prisma from '@/lib/db'
import AdminShopList from '@/components/AdminShopList'

type SearchParams = {
  status?: string
}

async function getShops(status?: string) {
  const where = status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)
    ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }
    : {}

  return prisma.shop.findMany({
    where,
    orderBy: { createdAt: 'desc' },
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Winkels beheren</h1>
        
        <div className="flex gap-2">
          <a 
            href="/admin/shops"
            className={`px-4 py-2 rounded-lg text-sm ${!params.status ? 'bg-accent text-white' : 'bg-white text-gray-700'}`}
          >
            Alle
          </a>
          <a 
            href="/admin/shops?status=PENDING"
            className={`px-4 py-2 rounded-lg text-sm ${params.status === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Wachtend
          </a>
          <a 
            href="/admin/shops?status=APPROVED"
            className={`px-4 py-2 rounded-lg text-sm ${params.status === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Goedgekeurd
          </a>
        </div>
      </div>

      <AdminShopList shops={shops} />
    </div>
  )
}
