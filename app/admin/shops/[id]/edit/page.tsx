'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type Category = {
  id: string
  name: string
  slug: string
  namePlural: string
  icon: string | null
}

type Shop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  longDescription: string | null
  address: string | null
  city: string | null
  country: string
  websiteUrl: string | null
  email: string | null
  phone: string | null
  logoUrl: string | null
  photos: string[]
  isPhysicalStore: boolean
  isWebshop: boolean
  isFeatured: boolean
  status: string
  categories: { category: Category }[]
  // Google Places
  googlePlaceId: string | null
  googleName: string | null
  googleAddress: string | null
  googleRating: number | null
  googleReviewCount: number | null
  googleReviewsUrl: string | null
  googleLastSyncedAt: string | null
}

export default function EditShopPage() {
  const router = useRouter()
  const params = useParams()
  const shopId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [allCategories, setAllCategories] = useState<Category[]>([])

  // Form state
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    address: '',
    city: '',
    country: 'BE',
    websiteUrl: '',
    email: '',
    phone: '',
    logoUrl: '',
    isPhysicalStore: false,
    isWebshop: true,
    isFeatured: false,
    status: 'APPROVED',
    // Google Places
    googlePlaceId: '',
    googleName: '',
    googleAddress: '',
    googleRating: '',
    googleReviewCount: '',
    googleReviewsUrl: '',
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  // Google Places search
  const [googleSearch, setGoogleSearch] = useState('')
  const [googleResults, setGoogleResults] = useState<any[]>([])
  const [googleSearching, setGoogleSearching] = useState(false)

  // Fetch shop data
  useEffect(() => {
    async function fetchShop() {
      try {
        const res = await fetch(`/api/admin/shops/${shopId}`)
        if (!res.ok) throw new Error('Winkel niet gevonden')

        const data = await res.json()
        const shop: Shop = data.shop

        setForm({
          name: shop.name,
          shortDescription: shop.shortDescription,
          longDescription: shop.longDescription || '',
          address: shop.address || '',
          city: shop.city || '',
          country: shop.country,
          websiteUrl: shop.websiteUrl || '',
          email: shop.email || '',
          phone: shop.phone || '',
          logoUrl: shop.logoUrl || '',
          isPhysicalStore: shop.isPhysicalStore,
          isWebshop: shop.isWebshop,
          isFeatured: shop.isFeatured,
          status: shop.status,
          // Google Places
          googlePlaceId: shop.googlePlaceId || '',
          googleName: shop.googleName || '',
          googleAddress: shop.googleAddress || '',
          googleRating: shop.googleRating != null ? String(shop.googleRating) : '',
          googleReviewCount: shop.googleReviewCount != null ? String(shop.googleReviewCount) : '',
          googleReviewsUrl: shop.googleReviewsUrl || '',
        })
        setPhotos(shop.photos || [])
        setSelectedCategories(shop.categories.map(sc => sc.category.id))
        setAllCategories(data.allCategories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fout bij laden')
      } finally {
        setLoading(false)
      }
    }

    fetchShop()
  }, [shopId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const addPhoto = () => {
    const url = newPhotoUrl.trim()
    if (url && !photos.includes(url)) {
      setPhotos(prev => [...prev, url])
      setNewPhotoUrl('')
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleGoogleSearch = async () => {
    if (!googleSearch.trim()) return
    setGoogleSearching(true)
    setGoogleResults([])
    try {
      const res = await fetch(`/api/admin/shops/google-search?q=${encodeURIComponent(googleSearch)}`)
      if (!res.ok) throw new Error('Zoeken mislukt')
      const data = await res.json()
      setGoogleResults(data.results || [])
    } catch (err) {
      setError('Google Places zoeken mislukt. Controleer of de API key is ingesteld.')
    } finally {
      setGoogleSearching(false)
    }
  }

  const selectGooglePlace = (place: any) => {
    setForm(prev => ({
      ...prev,
      googlePlaceId: place.placeId || '',
      googleName: place.name || '',
      googleAddress: place.address || '',
      googleRating: place.rating != null ? String(place.rating) : '',
      googleReviewCount: place.reviewCount != null ? String(place.reviewCount) : '',
      googleReviewsUrl: place.reviewsUrl || '',
    }))
    setGoogleResults([])
    setGoogleSearch('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/admin/shops/${shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          photos,
          categoryIds: selectedCategories,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Opslaan mislukt')
      }

      setSuccess('Winkel succesvol bijgewerkt!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/shops" className="text-sm text-gray-500 hover:text-accent">
            ← Terug naar winkels
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Winkel bewerken: {form.name}
          </h1>
        </div>
        <a
          href={`/shops/${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
          target="_blank"
          className="text-sm text-accent hover:underline"
        >
          Bekijk op site →
        </a>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basisgegevens ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basisgegevens</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Korte beschrijving * <span className="text-gray-400">({form.shortDescription.length}/200)</span>
              </label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                maxLength={200}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uitgebreide beschrijving
              </label>
              <textarea
                name="longDescription"
                value={form.longDescription}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Uitgebreide tekst over de winkel, producten, service..."
              />
            </div>
          </div>
        </section>

        {/* ── Categorieën ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorieën</h2>
          <p className="text-sm text-gray-500 mb-4">
            Duid aan welke categorieën van toepassing zijn op deze winkel.
          </p>

          {allCategories.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              Geen categorieën gevonden. Voer eerst de seed uit (npm run db:seed).
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allCategories.map(cat => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedCategories.includes(cat.id)
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{cat.name}</div>
                    <div className="text-xs text-gray-500">{cat.namePlural}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* ── Locatie & Contact ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Locatie & Contact</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Straatnaam 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="BE">België</option>
                <option value="NL">Nederland</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={form.websiteUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="+32 ..."
              />
            </div>
          </div>
        </section>

        {/* ── Type winkel & Status ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Type & Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isWebshop"
                  checked={form.isWebshop}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <div>
                  <span className="font-medium text-gray-900">🌐 Webshop</span>
                  <p className="text-xs text-gray-500">Verkoopt online</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPhysicalStore"
                  checked={form.isPhysicalStore}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <div>
                  <span className="font-medium text-gray-900">🏪 Fysieke winkel</span>
                  <p className="text-xs text-gray-500">Heeft een fysieke locatie</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <div>
                  <span className="font-medium text-gray-900">⭐ Uitgelicht</span>
                  <p className="text-xs text-gray-500">Verschijnt bovenaan en op de homepage</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="PENDING">⏳ Wachtend</option>
                <option value="APPROVED">✅ Goedgekeurd</option>
                <option value="REJECTED">❌ Afgewezen</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Logo & Foto's ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo & Foto&apos;s</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                name="logoUrl"
                value={form.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="https://voorbeeld.com/logo.png"
              />
              {form.logoUrl && (
                <div className="mt-2">
                  <img
                    src={form.logoUrl}
                    alt="Logo preview"
                    className="h-16 w-auto object-contain rounded border bg-gray-50 p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto&apos;s ({photos.length})
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="https://voorbeeld.com/foto.jpg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addPhoto()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addPhoto}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition"
                >
                  Toevoegen
                </button>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="12">Fout</text></svg>'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        title="Verwijderen"
                      >
                        ✕
                      </button>
                      <div className="text-xs text-gray-400 mt-1 truncate">{photo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Google Places ── */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Google Places koppeling</h2>
          
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoek op Google Places
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={googleSearch}
                onChange={(e) => setGoogleSearch(e.target.value)}
                placeholder={`Bijv. "${form.name} ${form.city}"`}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleGoogleSearch()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleGoogleSearch}
                disabled={googleSearching || !googleSearch.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {googleSearching ? 'Zoeken...' : 'Zoeken'}
              </button>
            </div>
          </div>

          {/* Search results */}
          {googleResults.length > 0 && (
            <div className="mb-4 border rounded-lg divide-y max-h-60 overflow-y-auto">
              {googleResults.map((place, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectGooglePlace(place)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-gray-900">{place.name}</div>
                  <div className="text-sm text-gray-500">{place.address}</div>
                  {place.rating && (
                    <div className="text-sm text-gray-600 mt-1">
                      ★ {place.rating} ({place.reviewCount} reviews)
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Current Google data */}
          {form.googlePlaceId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Gekoppeld aan Google Places</p>
                  <p className="text-sm text-blue-700 mt-1">{form.googleName}</p>
                  <p className="text-xs text-blue-600">{form.googleAddress}</p>
                  {form.googleRating && (
                    <p className="text-sm text-blue-700 mt-1">
                      ★ {form.googleRating} ({form.googleReviewCount} reviews)
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      googlePlaceId: '',
                      googleName: '',
                      googleAddress: '',
                      googleRating: '',
                      googleReviewCount: '',
                      googleReviewsUrl: '',
                    }))
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Ontkoppelen
                </button>
              </div>
            </div>
          )}

          {/* Manual fields (hidden by default, toggle) */}
          <details className="text-sm">
            <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
              Handmatig bewerken
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Place ID</label>
                <input type="text" name="googlePlaceId" value={form.googlePlaceId} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Google Naam</label>
                <input type="text" name="googleName" value={form.googleName} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Google Adres</label>
                <input type="text" name="googleAddress" value={form.googleAddress} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
                <input type="number" step="0.1" name="googleRating" value={form.googleRating} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Aantal reviews</label>
                <input type="number" name="googleReviewCount" value={form.googleReviewCount} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Reviews URL</label>
                <input type="url" name="googleReviewsUrl" value={form.googleReviewsUrl} onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded text-sm" placeholder="https://search.google.com/local/reviews?placeid=..." />
              </div>
            </div>
          </details>
        </section>

        {/* ── Acties ── */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/shops"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition text-gray-700"
          >
            Annuleren
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition disabled:opacity-50"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
