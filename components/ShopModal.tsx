'use client'

import { useEffect } from 'react'

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
}

type ShopModalProps = {
  shop: Shop
  isOpen: boolean
  onClose: () => void
}

export default function ShopModal({ shop, isOpen, onClose }: ShopModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            {shop.logoUrl ? (
              <img 
                src={shop.logoUrl} 
                alt={shop.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center">
                <span className="text-3xl text-accent font-bold">
                  {shop.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {shop.city && <span>{shop.city}</span>}
                {shop.city && <span>•</span>}
                <span>{shop.country === 'BE' ? 'België' : 'Nederland'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Over deze winkel</h3>
            <p className="text-gray-600">
              {shop.longDescription || shop.shortDescription}
            </p>
          </div>

          {/* Type */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Type</h3>
            <div className="flex gap-2">
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

          {/* Contact info */}
          {(shop.address || shop.websiteUrl || shop.email || shop.phone) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contactgegevens</h3>
              <div className="space-y-3">
                {shop.address && (
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600">
                      {shop.address}
                      {shop.city && `, ${shop.city}`}
                      {shop.country && `, ${shop.country === 'BE' ? 'België' : 'Nederland'}`}
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
                      className="text-accent hover:underline"
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <a
            href={`/shops/${shop.slug}`}
            className="block w-full text-center py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
          >
            Bekijk reviews & meer
          </a>
        </div>
      </div>
    </div>
  )
}
