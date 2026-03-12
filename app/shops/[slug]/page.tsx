import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { generateShopMetadata, generateShopJsonLd } from '@/lib/seo'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getShop(slug: string) {
  return prisma.shop.findUnique({
    where: { slug, status: 'APPROVED' },
    include: {
      reviews: {
        where: { isVerified: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShop(slug)
  if (!shop) return { title: 'Winkel niet gevonden' }
  return generateShopMetadata(shop)
}

export async function generateStaticParams() {
  try {
    const shops = await prisma.shop.findMany({
      where: { status: 'APPROVED' },
      select: { slug: true },
    })
    return shops.map(shop => ({ slug: shop.slug }))
  } catch {
    return []
  }
}
export default async function ShopDetailPage({ params }: PageProps) {
  const { slug } = await params
  const shop = await getShop(slug)

  if (!shop) {
    notFound()
  }

  const avgRating = shop.reviews.length > 0
    ? shop.reviews.reduce((sum, r) => sum + r.score, 0) / shop.reviews.length
    : 0

  const jsonLd = generateShopJsonLd({
    ...shop,
    averageRating: avgRating,
    reviewCount: shop.reviews.length,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            {shop.logoUrl ? (
              <img 
                src={shop.logoUrl} 
                alt={shop.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-primary-100 flex items-center justify-center">
                <span className="text-4xl text-accent font-bold">
                  {shop.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={avgRating} size="md" />
                  <span className="text-gray-600">
                    {avgRating.toFixed(1)} ({shop.reviews.length} reviews)
                  </span>
                </div>
                
                {shop.city && (
                  <span className="text-gray-500">
                    📍 {shop.city}, {shop.country === 'BE' ? 'België' : 'Nederland'}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{shop.longDescription || shop.shortDescription}</p>

              <div className="flex flex-wrap gap-2">
                {shop.isWebshop && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    🌐 Webshop
                  </span>
                )}
                {shop.isPhysicalStore && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                    🏪 Fysieke winkel
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {shop.websiteUrl && (
                <a
                  href={shop.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center whitespace-nowrap"
                >
                  Bezoek website →
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Reviews ({shop.reviews.length})
            </h2>

            {shop.reviews.length > 0 ? (
              <div className="space-y-4">
                {shop.reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-gray-900">{review.reviewerName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('nl-BE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <StarRating rating={review.score} size="sm" />
                    </div>
                    <p className="text-gray-600">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-500">Nog geen reviews voor deze winkel.</p>
                <p className="text-gray-500">Wees de eerste om een review te schrijven!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact info */}
            {(shop.address || shop.websiteUrl || shop.email || shop.phone) && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Contactgegevens</h3>
                <div className="space-y-3 text-sm">
                  {shop.address && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-400">📍</span>
                      <span className="text-gray-600">
                        {shop.address}
                        {shop.city && `, ${shop.city}`}
                      </span>
                    </div>
                  )}
                  {shop.websiteUrl && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">🌐</span>
                      <a 
                        href={shop.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline break-all"
                      >
                        {shop.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    </div>
                  )}
                  {shop.email && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">✉️</span>
                      <a 
                        href={`mailto:${shop.email}`}
                        className="text-accent hover:underline"
                      >
                        {shop.email}
                      </a>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">📞</span>
                      <a 
                        href={`tel:${shop.phone}`}
                        className="text-accent hover:underline"
                      >
                        {shop.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Review form */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Schrijf een review</h3>
              <ReviewForm shopId={shop.id} shopName={shop.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
