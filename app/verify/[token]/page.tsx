import prisma from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function verifyReview(token: string) {
  const review = await prisma.review.findFirst({
    where: {
      verificationToken: token,
      isVerified: false,
    },
    include: {
      shop: { select: { name: true, slug: true } },
    },
  })

  if (!review) {
    return { success: false, error: 'Ongeldige of verlopen verificatielink' }
  }

  // Check if token is expired
  if (review.tokenExpiresAt && review.tokenExpiresAt < new Date()) {
    return { success: false, error: 'Verificatielink is verlopen' }
  }

  // Verify the review
  await prisma.review.update({
    where: { id: review.id },
    data: {
      isVerified: true,
      verificationToken: null,
      tokenExpiresAt: null,
    },
  })

  return {
    success: true,
    shopName: review.shop.name,
    shopSlug: review.shop.slug,
  }
}

export default async function VerifyPage({
  params,
}: {
  params: { token: string }
}) {
  const result = await verifyReview(params.token)

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      {result.success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Review geverifieerd!
          </h1>
          <p className="text-green-700 mb-6">
            Je review voor {result.shopName} is nu zichtbaar op de website.
          </p>
          <Link href={`/shops/${result.shopSlug}`} className="btn-primary">
            Bekijk winkel
          </Link>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-4xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Verificatie mislukt
          </h1>
          <p className="text-red-700 mb-6">
            {result.error}
          </p>
          <Link href="/" className="text-accent hover:underline">
            Terug naar homepage
          </Link>
        </div>
      )}
    </div>
  )
}
