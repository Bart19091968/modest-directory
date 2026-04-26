'use client'

import { useState } from 'react'

const CATEGORIES = [
  { slug: 'hijab-shops', name: 'Hijab Shops' },
  { slug: 'abaya-shops', name: 'Abaya Winkels' },
  { slug: 'islamitische-kleding', name: 'Islamitische Kleding' },
]

export default function GratisAanmeldenClient() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    shortDescription: '',
    address: '',
    city: '',
    country: 'BE',
    websiteUrl: '',
    phone: '',
    isPhysicalStore: false,
    isWebshop: true,
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subscriptionTier: '',
          categorySlugs: selectedCategories,
          logoUrl: null,
          photos: [],
          openingHours: null,
          facebookUrl: null,
          instagramUrl: null,
          pinterestUrl: null,
          youtubeUrl: null,
          tiktokUrl: null,
          longDescription: null,
          invoiceRequested: false,
        }),
      })
      const data = await res.json()
      if (res.ok) setSuccess(true)
      else setError(data.error || 'Er ging iets mis')
    } catch {
      setError('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Bedankt voor je aanmelding!</h3>
        <p className="text-green-700 mb-4">
          Je winkel is succesvol aangemeld. Je vermelding wordt actief zodra ze door ons team is goedgekeurd.
        </p>
        <p className="text-green-600 text-sm">
          Je ontvangt een bevestigingsmail zodra je winkel is goedgekeurd.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>}

      {/* Basic info */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Basisgegevens</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Winkelnaam *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              required className="input" placeholder="Jouw winkelnaam" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required className="input" placeholder="contact@jouwwinkel.nl" />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Korte beschrijving * <span className="text-gray-400">(max. 200 tekens)</span></label>
          <textarea value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })}
            required maxLength={200} rows={3} className="input"
            placeholder="Beschrijf je winkel in max. 200 tekens..." />
          <p className="text-xs text-gray-400 mt-1">{form.shortDescription.length}/200</p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
          <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
            className="input" placeholder="Keizerslaan 20, 1000 Brussel" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
            <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
              className="input" placeholder="Brussel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land *</label>
            <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="input">
              <option value="BE">België</option>
              <option value="NL">Nederland</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input type="url" value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
              className="input" placeholder="https://www.jouwwinkel.be" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="input" placeholder="+32 xxx xx xx xx" />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Type winkel & Categorieën</h4>
          <p className="text-xs text-gray-500 mb-3">Selecteer welk type winkel je bent en in welke categorieën je actief bent:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isWebshop} onChange={e => setForm({ ...form, isWebshop: e.target.checked })}
                className="w-5 h-5 text-accent rounded" />
              <span className="text-sm">Webshop</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPhysicalStore} onChange={e => setForm({ ...form, isPhysicalStore: e.target.checked })}
                className="w-5 h-5 text-accent rounded" />
              <span className="text-sm">Fysieke winkel</span>
            </label>
            {<div className="w-full bg-gray-200 h-px my-1" />}
            {CATEGORIES.map(cat => (
              <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)} className="w-5 h-5 text-accent rounded" />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 text-lg py-4">
        {loading ? 'Verzenden...' : 'Gratis aanmelden'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Door je aan te melden ga je akkoord met onze voorwaarden.
        Je vermelding wordt actief na goedkeuring door ons team.
      </p>
    </form>
  )
}
