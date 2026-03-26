'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_LOGO_SIZE = 500 * 1024 // 500KB
const MAX_PHOTO_SIZE = 1024 * 1024 // 1MB
const MAX_PHOTOS = 5

export default function ShopRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    shortDescription: '',
    city: '',
    country: 'BE',
    websiteUrl: '',
    phone: '',
    isPhysicalStore: false,
    isWebshop: true,
    // Invoice fields
    invoiceRequested: false,
    invoiceCompanyName: '',
    invoiceVatNumber: '',
    invoiceAddress: '',
    invoiceEmail: '',
  })

  const [logo, setLogo] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_LOGO_SIZE) {
      setError('Logo mag maximaal 500KB zijn')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Alleen afbeeldingen zijn toegestaan')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setLogo(base64)
      setLogoPreview(base64)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`Je kunt maximaal ${MAX_PHOTOS} foto's uploaden`)
      return
    }

    const newPhotos: string[] = []
    const newPreviews: string[] = []
    let processed = 0

    Array.from(files).forEach(file => {
      if (file.size > MAX_PHOTO_SIZE) {
        setError('Elke foto mag maximaal 1MB zijn')
        return
      }

      if (!file.type.startsWith('image/')) {
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        newPhotos.push(base64)
        newPreviews.push(base64)
        processed++

        if (processed === files.length) {
          setPhotos(prev => [...prev, ...newPhotos])
          setPhotoPreviews(prev => [...prev, ...newPreviews])
          setError('')
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(null)
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
          logoUrl: logo,
          photos: photos,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Bedankt voor je aanmelding!</h3>
        <p className="text-green-700 mb-4">
          Je winkel is succesvol aangemeld. Om je vermelding te activeren, 
          maak €100 over naar onderstaand rekeningnummer.
        </p>
        <div className="bg-white rounded-lg p-4 mb-4 inline-block">
          <p className="text-gray-600 text-sm mb-1">Rekeningnummer:</p>
          <p className="text-xl font-mono font-bold text-gray-900">BE07 9734 4192 5566</p>
          <p className="text-gray-600 text-sm mt-2">Vermeld je winkelnaam bij de betaling</p>
        </div>
        <p className="text-green-600 text-sm">
          Je ontvangt een bevestigingsmail zodra je betaling is ontvangen en je winkel is goedgekeurd.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pricing info */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💰</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Vermelding: €100 voor 3 maanden</h3>
            <p className="text-gray-600 text-sm">
              Na aanmelding ontvang je de betalingsgegevens. Je vermelding wordt actief 
              zodra de betaling is ontvangen.
            </p>
            <div className="mt-3 p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Betalen op rekening:</p>
              <p className="font-mono font-bold text-gray-900">BE07 9734 4192 5566</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Winkelnaam *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="input"
            placeholder="Jouw winkelnaam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="input"
            placeholder="contact@jouwwinkel.nl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Korte beschrijving *
        </label>
        <textarea
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          required
          maxLength={200}
          rows={3}
          className="input"
          placeholder="Beschrijf je winkel in max. 200 tekens..."
        />
        <p className="text-xs text-gray-500 mt-1">{form.shortDescription.length}/200</p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo (optioneel)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Je logo wordt getoond bij je winkelvermelding. Max. 500KB, vierkant formaat aanbevolen.
        </p>
        
        {logoPreview ? (
          <div className="flex items-center gap-4">
            <img 
              src={logoPreview} 
              alt="Logo preview" 
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={removeLogo}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Verwijderen
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
            <div className="text-center">
              <div className="text-3xl mb-1">📷</div>
              <p className="text-sm text-gray-600">Klik om logo te uploaden</p>
              <p className="text-xs text-gray-400">PNG, JPG tot 500KB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Photos upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto's van je winkel (optioneel)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Voeg tot {MAX_PHOTOS} foto's toe van je producten of winkel. Max. 1MB per foto.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          {photoPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Foto ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          
          {photos.length < MAX_PHOTOS && (
            <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
              <div className="text-center">
                <div className="text-2xl mb-1">+</div>
                <p className="text-xs text-gray-500">Foto toevoegen</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stad
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="input"
            placeholder="Amsterdam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Land *
          </label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="input"
          >
            <option value="BE">België</option>
            <option value="NL">Nederland</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            className="input"
            placeholder="https://www.jouwwinkel.nl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefoonnummer
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
            placeholder="+32 xxx xx xx xx"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isWebshop}
            onChange={(e) => setForm({ ...form, isWebshop: e.target.checked })}
            className="w-5 h-5 text-accent rounded"
          />
          <span>Webshop</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPhysicalStore}
            onChange={(e) => setForm({ ...form, isPhysicalStore: e.target.checked })}
            className="w-5 h-5 text-accent rounded"
          />
          <span>Fysieke winkel</span>
        </label>
      </div>

      {/* Invoice section */}
      <div className="border-t pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.invoiceRequested}
            onChange={(e) => setForm({ ...form, invoiceRequested: e.target.checked })}
            className="w-5 h-5 text-accent rounded"
          />
          <span className="font-medium text-gray-900">Ik wens een factuur te ontvangen</span>
        </label>

        {form.invoiceRequested && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Factuurgegevens</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrijfsnaam *
              </label>
              <input
                type="text"
                value={form.invoiceCompanyName}
                onChange={(e) => setForm({ ...form, invoiceCompanyName: e.target.value })}
                required={form.invoiceRequested}
                className="input"
                placeholder="Jouw Bedrijf BV"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTW-nummer *
              </label>
              <input
                type="text"
                value={form.invoiceVatNumber}
                onChange={(e) => setForm({ ...form, invoiceVatNumber: e.target.value })}
                required={form.invoiceRequested}
                className="input"
                placeholder="BE0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Factuuradres *
              </label>
              <textarea
                value={form.invoiceAddress}
                onChange={(e) => setForm({ ...form, invoiceAddress: e.target.value })}
                required={form.invoiceRequested}
                rows={2}
                className="input"
                placeholder="Straat 123&#10;1000 Brussel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email voor factuur *
              </label>
              <input
                type="email"
                value={form.invoiceEmail}
                onChange={(e) => setForm({ ...form, invoiceEmail: e.target.value })}
                required={form.invoiceRequested}
                className="input"
                placeholder="factuur@jouwbedrijf.be"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'Verzenden...' : 'Winkel aanmelden (€100 voor 3 maanden)'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Door je aan te melden ga je akkoord met onze voorwaarden. 
        Je vermelding wordt actief na ontvangst van de betaling.
      </p>
    </form>
  )
}
