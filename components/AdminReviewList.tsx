'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Review = {
  id: string
  reviewerName: string
  reviewerEmail: string
  score: number
  reviewText: string
  isVerified: boolean
  createdAt: Date
  shop: {
    name: string
    slug: string
  }
}

export default function AdminReviewList({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Weet je zeker dat je deze review wilt verwijderen?')) return
    
    setLoading(reviewId)
    try {
      await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500">
        Geen reviews gevonden
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className={`bg-white rounded-xl p-6 shadow-sm ${loading === review.id ? 'opacity-50' : ''}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-medium text-gray-900">{review.reviewerName}</p>
              <p className="text-sm text-gray-500">{review.reviewerEmail}</p>
            </div>
            <div className="text-right">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= review.score ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {review.isVerified ? '✓ Geverifieerd' : 'Niet geverifieerd'}
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{review.reviewText}</p>
          
          <div className="flex justify-between items-center pt-3 border-t">
            <a href={`/shops/${review.shop.slug}`} target="_blank" className="text-accent text-sm hover:underline">
              {review.shop.name}
            </a>
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Verwijderen
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
