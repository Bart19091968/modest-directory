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
            {(shop.subscriptionTier && shop.logoUrl) ? (
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

              <div className="flex items-center gap-2">
                {shop.subscriptionTier === 'GOLD' && (
                  <img src="/trusted-partner-badge.png" alt="Trusted Partner" title="Trusted Partner" className="h-20 w-auto" />
                )}
                {shop.isFeatured && shop.subscriptionTier !== 'GOLD' && (
                  <span className="text-2xl" title="Uitgelichte winkel">⭐</span>
                )}
              </div>
            </div>

            {/* Rating - only for subscribed shops */}
            {shop.subscriptionTier && reviewData.reviewCount > 0 && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <StarRating rating={Math.round(reviewData.averageRating)} readonly />
                  <span className="text-lg font-medium text-gray-900">
                    {reviewData.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500">
                    ({reviewData.reviewCount} review{reviewData.reviewCount !== 1 ? 's' : ''})
                  </span>
                  {reviewData.source === 'google' && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Google</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-700 text-lg mb-6">{shop.shortDescription}</p>

        {/* Long description — only for SILVER and GOLD */}
        {(shop.subscriptionTier === 'SILVER' || shop.subscriptionTier === 'GOLD') && shop.longDescription && (
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
          {shop.subscriptionTier && (shop.googlePlaceId || shop.googleReviewsUrl) && (
            <a
              href={
                shop.googlePlaceId
                  ? `https://search.google.com/local/reviews?placeid=${shop.googlePlaceId}`
                  : shop.googleReviewsUrl!
              }
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
          {shop.subscriptionTier && shop.isPhysicalStore && (shop.googlePlaceId || shop.address) && (
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
            <span>
              {[shop.address, shop.city, shop.country === 'NL' ? 'Nederland' : 'België']
                .filter(Boolean)
                .join(', ')}
            </span>
          </p>
        )}

        {/* Categories */}
        {shop.categories.length > 0 && (
          <div className="pt-6 pb-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categorieën</h3>
            <div className="flex flex-wrap gap-2">
              {shop.categories.map(({ category }) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Social media links (GOLD) */}
        {shop.subscriptionTier === 'GOLD' && (
          shop.facebookUrl || shop.instagramUrl || shop.pinterestUrl || shop.youtubeUrl || shop.tiktokUrl
        ) && (
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Social media</h3>
            <div className="flex flex-wrap gap-3">
              {shop.facebookUrl && (
                <a href={shop.facebookUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition">
                  <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              )}
              {shop.instagramUrl && (
                <a href={shop.instagramUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm hover:bg-pink-100 transition">
                  <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              )}
              {shop.pinterestUrl && (
                <a href={shop.pinterestUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100 transition">
                  <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                  Pinterest
                </a>
              )}
              {shop.youtubeUrl && (
                <a href={shop.youtubeUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100 transition">
                  <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                  YouTube
                </a>
              )}
              {shop.tiktokUrl && (
                <a href={shop.tiktokUrl} target="_blank" rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-gray-100 transition">
                  <svg className="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                  </svg>
                  TikTok
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Photo Gallery — tier-limited: SILVER max 3, GOLD max 5, BRONZE none */}
      {(() => {
        const maxPhotos = shop.subscriptionTier === 'GOLD' ? 5 : shop.subscriptionTier === 'SILVER' ? 3 : 0
        const visiblePhotos = shop.photos?.slice(0, maxPhotos) ?? []
        if (visiblePhotos.length === 0) return null
        return (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Foto&apos;s</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {visiblePhotos.map((photo, index) => (
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
        )
      })()}

      {/* Opening hours (GOLD) */}
      {shop.subscriptionTier === 'GOLD' && shop.openingHours && (
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Openingsuren</h2>
          <div className="space-y-2">
            {(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const).map(dayKey => {
              const DAY_LABELS: Record<string, string> = {
                monday: 'Maandag', tuesday: 'Dinsdag', wednesday: 'Woensdag',
                thursday: 'Donderdag', friday: 'Vrijdag', saturday: 'Zaterdag', sunday: 'Zondag',
              }
              const hours = (shop.openingHours as any)?.[dayKey]
              if (!hours) return null
              return (
                <div key={dayKey} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="w-28 text-sm font-medium text-gray-700">{DAY_LABELS[dayKey]}</span>
                  {hours.closed ? (
                    <span className="text-sm text-gray-400">Gesloten</span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {hours.open} – {hours.close}
                      {hours.lunchBreak && (
                        <span className="text-gray-400 ml-2">(middagpauze {hours.lunchOpen} – {hours.lunchClose})</span>
                      )}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Reviews — only for subscribed shops */}
      {shop.subscriptionTier && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </div>}
    </div>
  )
}
