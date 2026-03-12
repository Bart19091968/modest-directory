'use client'

import { useState } from 'react'
import StarRating from './StarRating'

type ReviewFormProps = {
  shopId: string
  shopName: string
}

export default function ReviewForm({ shopId, shopName }: ReviewFormProps) {
  const [score, setScore] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (score === 0) {
      setErrorMessage('Selecteer een score')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/reviews', {
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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er ging iets mis')
      }

      setStatus('success')
      setScore(0)
      setName('')
      setEmail('')
      setReviewText('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h3 className="font-semibold text-green-800 mb-2">Bedankt voor je review!</h3>
        <p className="text-green-700">
          We hebben een bevestigingsmail gestuurd naar <strong>{email}</strong>. 
          Klik op de link in de email om je review te publiceren.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-accent hover:underline"
        >
          Nog een review schrijven
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label">Je score voor {shopName}</label>
        <div className="flex items-center gap-4">
          <StarRating 
            rating={score} 
            size="lg" 
            interactive 
            onRate={setScore} 
          />
          <span className="text-gray-500 text-sm">
            {score > 0 ? `${score} van 5 sterren` : 'Klik om te scoren'}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="label">Je naam</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="input"
          placeholder="Voornaam of bijnaam"
        />
      </div>

      <div>
        <label htmlFor="email" className="label">Je emailadres</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input"
          placeholder="naam@voorbeeld.be"
        />
        <p className="text-xs text-gray-500 mt-1">
          We sturen een bevestigingsmail. Je emailadres wordt niet getoond.
        </p>
      </div>

      <div>
        <label htmlFor="review" className="label">Je review</label>
        <textarea
          id="review"
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          required
          rows={4}
          className="input resize-none"
          placeholder="Deel je ervaring met deze winkel..."
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Verzenden...' : 'Review verzenden'}
      </button>
    </form>
  )
}
