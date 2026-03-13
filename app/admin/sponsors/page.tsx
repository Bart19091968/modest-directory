export const dynamic = 'force-dynamic'

import prisma from '@/lib/db'
import AdminSponsorList from '@/components/AdminSponsorList'

async function getSponsors() {
  return prisma.sponsor.findMany({
    orderBy: [
      { isActive: 'desc' },
      { position: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sponsors beheren</h1>
        
          <a href="/admin/sponsors/new"
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Nieuwe sponsor
        </a>
      </div>
      <AdminSponsorList sponsors={sponsors} />
    </div>
  )
}