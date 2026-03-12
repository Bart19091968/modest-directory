export const dynamic = 'force-dynamic'
import prisma from '@/lib/db'
import AdminReviewList from '@/components/AdminReviewList'

async function getReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      shop: { select: { name: true, slug: true } },
    },
  })
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Reviews beheren</h1>
      <AdminReviewList reviews={reviews} />
    </div>
  )
}
