import { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/db'

export const metadata: Metadata = {
  title: 'Review Bevestigen',
}

type PageProps = {
  params: Promise<{ token: string }>
}

async function verifyReview(token: string) {
  const review = await prisma.review.findUnique({
    where: { verificationToken: token },
    include: { shop: { select: { name: true, slug: true } } },
  })

  if (!review) {
    return { success: false, error: 'Token niet gevonden' }
  }

  if (review.isVerified) {
    return { 
      success: true, 
      alreadyVerified: true, 
      shopName: review.shop.name,
      shopSlug: review.shop.slug,
    }
  }

  await prisma.review.update({
    where: { id: review.id },
    data: { isVerified: true },
  })

  return { 
    success: true, 
    alreadyVerified: false,
    shopName: review.shop.name,
    shopSlug: review.shop.slug,
  }
}

export default async function VerifyPage({ params }: PageProps) {
  const { token } = await params
  const result = await verifyReview(token)

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {result.success ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {result.alreadyVerified ? 'Al bevestigd!' : 'Review bevestigd!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {result.alreadyVerified 
              ? 'Je review voor deze winkel was al bevestigd.'
              : `Je review voor ${result.shopName} is nu zichtbaar voor iedereen.`
            }
          </p>
          <Link 
            href={`/shops/${result.shopSlug}`}
            className="btn-primary inline-block"
          >
            Bekijk de winkel →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-gray-100">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Link ongeldig
          </h1>
          <p className="text-gray-600 mb-6">
            Deze bevestigingslink is ongeldig of verlopen.
          </p>
          <Link 
            href="/"
            className="text-accent hover:underline"
          >
            Terug naar home
          </Link>
        </div>
      )}
    </div>
  )
}
