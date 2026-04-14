'use client'

import Link from 'next/link'
import { getVisibleReviewData } from '@/lib/reviews'

type Review = {
  score: number
}

type Shop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  city: string | null
  country: string
  isPhysicalStore: boolean
  isWebshop: boolean
  isFeatured?: boolean
  logoUrl?: string | null
  reviews: Review[]
  subscriptionTier?: string | null
  // Google Places
  googlePlaceId?: string | null
  googleRating?: number | null
  googleReviewCount?: number | null
  // Social media (GOLD)
  facebookUrl?: string | null
  instagramUrl?: string | null
  pinterestUrl?: string | null
  youtubeUrl?: string | null
  tiktokUrl?: string | null
}

export default function ShopCard({ shop }: { shop: Shop }) {
  const mdAverage = shop.reviews.length > 0
    ? shop.reviews.reduce((acc, r) => acc + r.score, 0) / shop.reviews.length
    : 0

  const reviewData = getVisibleReviewData({
    googlePlaceId: shop.googlePlaceId,
    googleRating: shop.googleRating,
    googleReviewCount: shop.googleReviewCount,
    modestDirectoryAverageRating: mdAverage,
    modestDirectoryReviewCount: shop.reviews.length,
  })

  const firstLetter = shop.name.charAt(0).toUpperCase()
  const isGold = shop.subscriptionTier === 'GOLD'

  const socialLinks = isGold ? [
    { url: shop.facebookUrl, label: 'Facebook', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )},
    { url: shop.instagramUrl, label: 'Instagram', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )},
    { url: shop.pinterestUrl, label: 'Pinterest', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    )},
    { url: shop.youtubeUrl, label: 'YouTube', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    )},
    { url: shop.tiktokUrl, label: 'TikTok', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    )},
  ].filter(s => s.url) : []

  return (
    <Link href={`/shops/${shop.slug}`} className="card p-6 block">
      <div className="flex gap-4 mb-3">
        {/* Logo or first letter */}
        <div className="flex-shrink-0">
          {(shop.subscriptionTier && shop.logoUrl) ? (
            <img
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              className="w-14 h-14 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">{firstLetter}</span>
            </div>
          )}
        </div>

        {/* Name and badges */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{shop.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isGold && (
                <img src="/trusted-partner-badge.png" alt="Trusted Partner" title="Trusted Partner" className="h-14 w-auto flex-shrink-0" />
              )}
              {shop.isFeatured && !isGold && (
                <span className="text-yellow-500">⭐</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📍 {shop.city || shop.country}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {shop.shortDescription}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {shop.isWebshop && (
          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">
            Webshop
          </span>
        )}
        {shop.isPhysicalStore && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
            Fysieke winkel
          </span>
        )}
      </div>

      {shop.subscriptionTier && reviewData.reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={star <= Math.round(reviewData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {reviewData.averageRating.toFixed(1)} ({reviewData.reviewCount} review{reviewData.reviewCount !== 1 ? 's' : ''})
          </span>
          {reviewData.source === 'google' && (
            <span className="text-xs text-gray-400">Google</span>
          )}
        </div>
      )}

      {/* Social media icons for GOLD — direct links, stop propagation to prevent card navigation */}
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t">
          {socialLinks.map(({ url, label, icon }) => (
            <a
              key={label}
              href={url!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={label}
              className="text-gray-400 hover:text-accent transition"
              onClick={e => e.stopPropagation()}
            >
              {icon}
            </a>
          ))}
        </div>
      )}
    </Link>
  )
}
