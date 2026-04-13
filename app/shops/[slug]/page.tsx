import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReviewForm from '@/components/ReviewForm'
import StarRating from '@/components/StarRating'
import { generateShopJsonLd, generateBreadcrumbListJsonLd } from '@/lib/seo'
import { getVisibleReviewData } from '@/lib/reviews'

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
  const description = shop.shortDescription
    ? `${shop.shortDescription} | Lees reviews en ontdek meer over ${shop.name} in ${location}.`
    : `${shop.name} - Islamitische kledingwinkel in ${location}. Bekijk reviews, openingstijden en contactgegevens op ModestDirectory.`

  return {
    title: `${shop.name} | Islamitische Kleding ${location}`,
    description,
    alternates: {
      canonical: `/shops/${shop.slug}`,
    },
    openGraph: {
      title: `${shop.name} - Islamitische Kleding ${location}`,
      description: shop.shortDescription || `${shop.name} - Islamitische kledingwinkel in ${location}`,
      type: 'website',
      images: shop.logoUrl
        ? [{ url: shop.logoUrl, alt: `${shop.name} logo` }]
        : [{ url: '/icon-512.png', width: 512, height: 512, alt: 'ModestDirectory' }],
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

  // ModestDirectory reviews
  const mdAverage = shop.reviews.length > 0
    ? shop.reviews.reduce((acc, r) => acc + r.score, 0) / shop.reviews.length
    : 0

  // Fallback logic for header rating
  const reviewData = getVisibleReviewData({
    googlePlaceId: shop.googlePlaceId,
    googleRating: shop.googleRating,
    googleReviewCount: shop.googleReviewCount,
    modestDirectoryAverageRating: mdAverage,
    modestDirectoryReviewCount: shop.reviews.length,
  })

  const location = shop.city ? `${shop.city}, ${shop.country}` : shop.country
  const firstLetter = shop.name.charAt(0).toUpperCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  const jsonLd = generateShopJsonLd({
    ...shop,
    averageRating: reviewData.averageRating,
    reviewCount: reviewData.reviewCount,
  })

  const breadcrumbJsonLd = generateBreadcrumbListJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Winkels', url: `${siteUrl}/shops` },
    { name: shop.name, url: `${siteUrl}/shops/${shop.slug}` },
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

            {/* Rating - with fallback logic */}
            {reviewData.reviewCount > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <StarRating rating={Math.round(reviewData.averageRating)} readonly />
                <span className="text-lg font-medium text-gray-900">
                  {reviewData.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({reviewData.reviewCount} review{reviewData.reviewCount !== 1 ? 's' : ''})
                </span>
                {reviewData.source === 'google' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Google</span>
                )}
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
        <div className="flex flex-wrap gap-4 mb-4">
          {shop.websiteUrl && (
            <a
              href={shop.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border-2 border-accent rounded-full hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Bezoek website
            </a>
          )}
          {shop.googleReviewsUrl && (
            <a
              href={shop.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Reviews op Google
            </a>
          )}
          {shop.phone && (
            <a
              href={`tel:${shop.phone}`}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 transition flex items-center gap-2"
            >
              📞 {shop.phone}
            </a>
          )}
          {shop.isPhysicalStore && (shop.googlePlaceId || shop.address) && (
            <a
              href={
                shop.googlePlaceId
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name)}&query_place_id=${shop.googlePlaceId}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address!)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5 pointer-events-none" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="goldRing" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFE066"/>
                    <stop offset="50%" stopColor="#F5A623"/>
                    <stop offset="100%" stopColor="#8B5E00"/>
                  </radialGradient>
                </defs>
                <circle cx="16" cy="16" r="15.5" fill="url(#goldRing)" stroke="#7A4F00" strokeWidth="0.5"/>
                <circle cx="16" cy="16" r="11.5" fill="#1a1a2e" stroke="#3a3a5c" strokeWidth="0.5"/>
                <polygon points="16,5 14.5,16 16,14.5 17.5,16" fill="#DC2626"/>
                <polygon points="16,27 14.5,16 16,17.5 17.5,16" fill="#60A5FA"/>
                <circle cx="16" cy="16" r="1.2" fill="white"/>
                <text x="16" y="9.5" textAnchor="middle" fontSize="3.8" fill="white" fontWeight="bold" fontFamily="Arial, sans-serif">N</text>
                <text x="16" y="25.5" textAnchor="middle" fontSize="3.8" fill="white" fontWeight="bold" fontFamily="Arial, sans-serif">S</text>
                <text x="6.5" y="17" textAnchor="middle" fontSize="3.8" fill="white" fontWeight="bold" fontFamily="Arial, sans-serif">W</text>
                <text x="25.5" y="17" textAnchor="middle" fontSize="3.8" fill="white" fontWeight="bold" fontFamily="Arial, sans-serif">E</text>
              </svg>
              Routebeschrijving
            </a>
          )}
        </div>

        {/* Address below buttons */}
        {shop.address && (
          <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
            <span>📍</span>
            <span>{shop.address}</span>
          </p>
        )}

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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Foto&apos;s</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            Reviews
            {mdAverage > 0 && (
              <span className="flex items-center gap-1">
                <span className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`text-base ${star <= Math.round(mdAverage) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </span>
                <span className="text-base font-normal text-gray-600">
                  {mdAverage.toFixed(1)} ({shop.reviews.length})
                </span>
              </span>
            )}
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
