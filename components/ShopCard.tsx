'use client'

import Link from 'next/link'
import { useState } from 'react'
import ShopModal from './ShopModal'
import StarRating from './StarRating'

type Shop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  longDescription?: string | null
  address?: string | null
  city?: string | null
  country: string
  websiteUrl?: string | null
  email?: string | null
  phone?: string | null
  logoUrl?: string | null
  isPhysicalStore: boolean
  isWebshop: boolean
  averageRating: number
  reviewCount: number
}

export default function ShopCard({ shop }: { shop: Shop }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="card hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Logo & Name */}
          <div className="flex items-start gap-4 mb-4">
            {shop.logoUrl ? (
              <img 
                src={shop.logoUrl} 
                alt={shop.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-accent font-bold">
                  {shop.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{shop.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {shop.city && <span>{shop.city}</span>}
                <span className="text-xs">•</span>
                <span>{shop.country}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={shop.averageRating} />
            <span className="text-sm text-gray-500">
              ({shop.reviewCount} {shop.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {shop.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {shop.isWebshop && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                Webshop
              </span>
            )}
            {shop.isPhysicalStore && (
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                Fysieke winkel
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 text-center py-2 text-accent border border-accent rounded-lg text-sm font-medium hover:bg-accent hover:text-white transition-colors"
            >
              Meer info
            </button>
            <Link
              href={`/shops/${shop.slug}`}
              className="flex-1 text-center py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              Bekijk reviews
            </Link>
          </div>
        </div>
      </div>

      <ShopModal 
        shop={shop} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
