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
  shop: { name: string; slug: string }
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
        <div 
          key={review.id} 
          className={`bg-white rounded-xl p-6 shadow-sm ${loading === review.id ? 'opacity-50' : ''}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                <span className="text-yellow-500">
                  {'★'.repeat(review.score)}{'☆'.repeat(5 - review.score)}
                </span>
                {!review.isVerified && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Onbevestigd
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {review.reviewerEmail} · {new Date(review.createdAt).toLocaleDateString('nl-BE')}
              </div>
              <div className="text-sm text-accent">
                Voor: <a href={`/shops/${review.shop.slug}`} className="hover:underline">{review.shop.name}</a>
              </div>
            </div>
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Verwijderen
            </button>
          </div>
          <p className="text-gray-600">{review.reviewText}</p>
        </div>
      ))}
    </div>
  )
}
