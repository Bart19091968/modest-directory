'use client'

import { useState } from 'react'

export default function ShopRegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    address: '',
    city: '',
    country: 'BE',
    websiteUrl: '',
    email: '',
    phone: '',
    isPhysicalStore: false,
    isWebshop: true,
    contactName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Er ging iets mis')
      }

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Aanmelding ontvangen!</h2>
        <p className="text-gray-600 mb-6">
          Bedankt voor je aanmelding. We bekijken je winkel zo snel mogelijk 
          en sturen je een bevestiging per email.
        </p>
        <a href="/" className="text-accent hover:underline">
          Terug naar home
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shop info */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Winkelgegevens</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="label">Winkelnaam *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="Bijv. Hijab House Amsterdam"
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className="label">
              Korte beschrijving * <span className="text-gray-400">(max 200 tekens)</span>
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              maxLength={200}
              className="input"
              placeholder="Bijv. Moderne hijabs en modest fashion voor de hedendaagse vrouw"
            />
          </div>

          <div>
            <label htmlFor="longDescription" className="label">
              Uitgebreide beschrijving <span className="text-gray-400">(optioneel)</span>
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Vertel meer over je winkel, assortiment, specialiteiten..."
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isWebshop"
                checked={formData.isWebshop}
                onChange={handleChange}
                className="w-5 h-5 text-accent rounded focus:ring-accent"
              />
              <span className="text-gray-700">Webshop</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPhysicalStore"
                checked={formData.isPhysicalStore}
                onChange={handleChange}
                className="w-5 h-5 text-accent rounded focus:ring-accent"
              />
              <span className="text-gray-700">Fysieke winkel</span>
            </label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Locatie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="label">Land *</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="input"
            >
              <option value="BE">🇧🇪 België</option>
              <option value="NL">🇳🇱 Nederland</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="label">Stad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input"
              placeholder="Bijv. Brussel"
            />
          </div>

          {formData.isPhysicalStore && (
            <div className="md:col-span-2">
              <label htmlFor="address" className="label">Adres</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input"
                placeholder="Straat en huisnummer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Contactgegevens</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="contactName" className="label">Je naam *</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="input"
              placeholder="Voor onze administratie"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">Emailadres *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="info@jouwwinkel.be"
            />
          </div>

          <div>
            <label htmlFor="websiteUrl" className="label">Website URL</label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://jouwwinkel.be"
            />
          </div>

          <div>
            <label htmlFor="phone" className="label">Telefoonnummer</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+32 123 45 67 89"
            />
          </div>
        </div>
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
        {isSubmitting ? 'Verzenden...' : 'Winkel aanmelden'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Door je aan te melden ga je akkoord met onze voorwaarden. 
        Je gegevens worden alleen gebruikt voor deze directory.
      </p>
    </form>
  )
}
