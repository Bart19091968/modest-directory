'use client'

import { useState } from 'react'
import StarRating from './StarRating'

interface ReviewFormProps {
  shopId: string
  shopName: string
  onSuccess?: () => void
}

export default function ReviewForm({ shopId, shopName, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [score, setScore] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          reviewerName: name,
          reviewerEmail: email,
          score,
          reviewText,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        onSuccess?.()
      } else {
        setError(data.error || 'Er ging iets mis')
      }
    } catch (err) {
      setError('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium">Bedankt voor je review!</p>
        <p className="text-green-600 text-sm mt-2">
          We hebben een verificatie-email gestuurd naar {email}. 
          Klik op de link in de email om je review te bevestigen.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Schrijf een review voor {shopName}</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Je naam</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
          placeholder="Fatima"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Je email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="fatima@voorbeeld.nl"
        />
        <p className="text-xs text-gray-500 mt-1">We sturen een verificatie-email</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Beoordeling</label>
        <StarRating rating={score} onRatingChange={setScore} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Je review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
          rows={4}
          className="input"
          placeholder="Vertel over je ervaring met deze winkel..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || score === 0}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'Verzenden...' : 'Review plaatsen'}
      </button>
    </form>
  )
}
