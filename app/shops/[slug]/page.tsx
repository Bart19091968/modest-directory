import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/ReviewForm'
import StarRating from '@/components/StarRating'
import { generateLocalBusinessJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

async function getShop(slug: string) {
  return prisma.shop.findUnique({
    where: { slug, status: 'APPROVED' },
    include: {
      reviews: {
        where: { isVerified: true },
        orderBy: { createdAt: 'desc' },
      },
      categories: {
        include: { category: true },
      },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const shop = await getShop(params.slug)

  if (!shop) {
    return { title: 'Winkel niet gevonden' }
  }

  const location = shop.city ? `${shop.city}, ${shop.country}` : shop.country

  return {
    title: `${shop.name} | Islamitische Kleding ${location}`,
    description: shop.shortDescription || `${shop.name} - Islamitische kledingwinkel in ${location}`,
    openGraph: {
      title: shop.name,
      description: shop.shortDescription || '',
      type: 'website',
      ...(shop.logoUrl && { images: [shop.logoUrl] }),
    },
  }
}

export default async function ShopDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const shop = await getShop(params.slug)

  if (!shop) {
    notFound()
  }

  const averageScore = shop.reviews.length > 0
    ? shop.reviews.reduce((acc, r) => acc + r.score, 0) / shop.reviews.length
    : null

  const location = shop.city ? `${shop.city}, ${shop.country}` : shop.country
  const firstLetter = shop.name.charAt(0).toUpperCase()

  const jsonLd = generateLocalBusinessJsonLd(shop)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/shops" className="hover:text-accent">Winkels</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{shop.name}</span>
      </nav>

      {/* Shop Header */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div className="flex flex-wrap gap-6 mb-6">
          {/* Logo or first letter */}
          <div className="flex-shrink-0">
            {shop.logoUrl ? (
              <img 
                src={shop.logoUrl} 
                alt={`${shop.name} logo`}
                className="w-24 h-24 rounded-xl object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-4xl font-bold text-accent">{firstLetter}</span>
              </div>
            )}
          </div>

          {/* Shop info */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <span>📍 {location}</span>
                  {shop.isWebshop && (
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                      Webshop
                    </span>
                  )}
                  {shop.isPhysicalStore && (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      Fysieke winkel
                    </span>
                  )}
                </div>
              </div>

              {shop.isFeatured && (
                <span className="text-2xl" title="Uitgelichte winkel">⭐</span>
              )}
            </div>

            {/* Rating */}
            {averageScore !== null && (
              <div className="flex items-center gap-3 mt-3">
                <StarRating rating={Math.round(averageScore)} readonly />
                <span className="text-lg font-medium text-gray-900">
                  {averageScore.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({shop.reviews.length} review{shop.reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-lg mb-6">{shop.shortDescription}</p>

        {/* Long description if available */}
        {shop.longDescription && (
          <div className="mb-6 text-gray-600">
            <p>{shop.longDescription}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          {shop.websiteUrl && (
            <a
              href={shop.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              🌐 Bezoek website
            </a>
          )}
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="px-6 py-3 border rounded-full hover:bg-gray-50 transition"
            >
              📞 {shop.phone}
            </a>
          )}
          {shop.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(shop.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border rounded-full hover:bg-gray-50 transition"
            >
              📍 Routebeschrijving
            </a>
          )}
        </div>

        {/* Categories */}
        {shop.categories.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categorieën</h3>
            <div className="flex flex-wrap gap-2">
              {shop.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}/${shop.country.toLowerCase()}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      {shop.photos && shop.photos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Foto's</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shop.photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={photo} 
                  alt={`${shop.name} foto ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Review List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Reviews ({shop.reviews.length})
          </h2>

          {shop.reviews.length === 0 ? (
            <p className="text-gray-500">Nog geen reviews voor deze winkel.</p>
          ) : (
            <div className="space-y-4">
              {shop.reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{review.reviewerName}</span>
                    <StarRating rating={review.score} readonly size="sm" />
                  </div>
                  <p className="text-gray-600">{review.reviewText}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="bg-gray-50 rounded-xl p-6">
          <ReviewForm shopId={shop.id} shopName={shop.name} />
        </div>
      </div>
    </div>
  )
}
