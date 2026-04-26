'use client'

import { useState } from 'react'

type Category = { id: string; name: string }

type DaySchedule = {
  closed: boolean
  open: string
  close: string
  lunchBreak: boolean
  lunchOpen: string
  lunchClose: string
}

type OpeningHours = Record<string, DaySchedule>

const DAYS = [
  { key: 'monday', label: 'Maandag' },
  { key: 'tuesday', label: 'Dinsdag' },
  { key: 'wednesday', label: 'Woensdag' },
  { key: 'thursday', label: 'Donderdag' },
  { key: 'friday', label: 'Vrijdag' },
  { key: 'saturday', label: 'Zaterdag' },
  { key: 'sunday', label: 'Zondag' },
]

const TIER_PRICES: Record<string, number> = { BRONZE: 100, SILVER: 150, GOLD: 200 }
const TIER_LABELS: Record<string, string> = { BRONZE: 'Brons', SILVER: 'Zilver', GOLD: 'Goud' }
const MAX_PHOTOS: Record<string, number> = { BRONZE: 0, SILVER: 3, GOLD: 5 }
const MAX_LOGO_SIZE = 500 * 1024
const MAX_PHOTO_SIZE = 1024 * 1024

function defaultDay(closed = false): DaySchedule {
  return { closed, open: '09:00', close: '18:00', lunchBreak: false, lunchOpen: '12:00', lunchClose: '13:30' }
}

function defaultHours(): OpeningHours {
  return {
    monday: defaultDay(),
    tuesday: defaultDay(),
    wednesday: defaultDay(),
    thursday: defaultDay(),
    friday: defaultDay(),
    saturday: { ...defaultDay(), open: '10:00', close: '17:00' },
    sunday: defaultDay(true),
  }
}

export default function ShopRegistrationForm({
  tier,
  categories,
}: {
  tier: string
  categories: Category[]
}) {
  const price = TIER_PRICES[tier] ?? 100
  const isSilverOrGold = tier === 'SILVER' || tier === 'GOLD'
  const isGold = tier === 'GOLD'
  const maxPhotos = MAX_PHOTOS[tier] ?? 0

  const [form, setForm] = useState({
    name: '',
    email: '',
    shortDescription: '',
    longDescription: '',
    address: '',
    city: '',
    country: 'BE',
    websiteUrl: '',
    phone: '',
    isPhysicalStore: false,
    isWebshop: true,
    facebookUrl: '',
    instagramUrl: '',
    pinterestUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    invoiceRequested: false,
    invoiceCompanyName: '',
    invoiceVatNumber: '',
    invoiceAddress: '',
    invoiceEmail: '',
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [openingHours, setOpeningHours] = useState<OpeningHours>(defaultHours())
  const [logo, setLogo] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const updateDay = (day: string, field: keyof DaySchedule, value: boolean | string) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_LOGO_SIZE) { setError('Logo mag maximaal 500KB zijn'); return }
    if (!file.type.startsWith('image/')) { setError('Alleen afbeeldingen zijn toegestaan'); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogo(reader.result as string)
      setLogoPreview(reader.result as string)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    if (photos.length + files.length > maxPhotos) {
      setError(`Je kunt maximaal ${maxPhotos} foto's uploaden`)
      return
    }
    const newPhotos: string[] = []
    let processed = 0
    Array.from(files).forEach(file => {
      if (file.size > MAX_PHOTO_SIZE) { setError("Elke foto mag maximaal 1MB zijn"); return }
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onloadend = () => {
        newPhotos.push(reader.result as string)
        processed++
        if (processed === files.length) {
          setPhotos(prev => [...prev, ...newPhotos])
          setPhotoPreviews(prev => [...prev, ...newPhotos])
          setError('')
        }
      }
      reader.readAsDataURL(file)
    })
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
          subscriptionTier: tier,
          categoryIds: selectedCategories,
          logoUrl: logo,
          photos,
          openingHours: isGold ? openingHours : null,
          facebookUrl: isGold ? form.facebookUrl : null,
          instagramUrl: isGold ? form.instagramUrl : null,
          pinterestUrl: isGold ? form.pinterestUrl : null,
          youtubeUrl: isGold ? form.youtubeUrl : null,
          tiktokUrl: isGold ? form.tiktokUrl : null,
          longDescription: isSilverOrGold ? form.longDescription : null,
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
          Je winkel is succesvol aangemeld als <strong>{TIER_LABELS[tier]}</strong> partner.
          Om je vermelding te activeren, maak €{price} over naar onderstaand rekeningnummer.
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tier badge */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border">
        <div>
          <p className="font-semibold text-gray-900">Gekozen formule: {TIER_LABELS[tier]}</p>
          <p className="text-sm text-gray-500">€{price} voor 3 maanden</p>
        </div>
      </div>

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
            {categories.length > 0 && <div className="w-px bg-gray-200 self-stretch hidden sm:block" />}
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)} className="w-5 h-5 text-accent rounded" />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Logo</h3>
        <p className="text-xs text-gray-500 mb-3">Max. 500KB, vierkant formaat aanbevolen.</p>
        {logoPreview ? (
          <div className="flex items-center gap-4">
            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg border" />
            <button type="button" onClick={() => { setLogo(null); setLogoPreview(null) }}
              className="text-red-600 hover:text-red-700 text-sm">Verwijderen</button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
            <div className="text-center">
              <div className="text-3xl mb-1">📷</div>
              <p className="text-sm text-gray-600">Klik om logo te uploaden</p>
              <p className="text-xs text-gray-400">PNG, JPG tot 500KB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </label>
        )}
      </div>

      {/* SILVER + GOLD: Long description & photos */}
      {isSilverOrGold && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Extra informatie</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lange beschrijving <span className="text-gray-400">(max. 1000 tekens)</span>
            </label>
            <textarea value={form.longDescription} onChange={e => setForm({ ...form, longDescription: e.target.value })}
              maxLength={1000} rows={5} className="input"
              placeholder="Vertel meer over je winkel, assortiment, specialiteiten..." />
            <p className="text-xs text-gray-400 mt-1">{form.longDescription.length}/1000</p>
          </div>
        </div>
      )}

      {/* Photos */}
      {maxPhotos > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">
            Foto&apos;s <span className="text-sm font-normal text-gray-500">(max. {maxPhotos})</span>
          </h3>
          <p className="text-xs text-gray-500 mb-3">Max. 1MB per foto.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photoPreviews.map((preview, i) => (
              <div key={i} className="relative">
                <img src={preview} alt={`Foto ${i + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                <button type="button" onClick={() => {
                  setPhotos(prev => prev.filter((_, j) => j !== i))
                  setPhotoPreviews(prev => prev.filter((_, j) => j !== i))
                }} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">×</button>
              </div>
            ))}
            {photos.length < maxPhotos && (
              <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition">
                <div className="text-center">
                  <div className="text-2xl mb-1">+</div>
                  <p className="text-xs text-gray-500">Foto toevoegen</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handlePhotosChange} className="hidden" />
              </label>
            )}
          </div>
        </div>
      )}

      {/* GOLD: Opening hours */}
      {isGold && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Openingsuren</h3>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="pb-3 pr-4 w-28">Dag</th>
                  <th className="pb-3 pr-4 w-24">Gesloten</th>
                  <th className="pb-3 pr-4">Open</th>
                  <th className="pb-3 pr-4">Sluit</th>
                  <th className="pb-3 pr-4 w-32">Middagsluiting</th>
                  <th className="pb-3 pr-4">Middag open</th>
                  <th className="pb-3">Middag sluit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DAYS.map(({ key, label }) => {
                  const day = openingHours[key]
                  return (
                    <tr key={key} className="py-2">
                      <td className="py-2 pr-4 font-medium text-gray-700">{label}</td>
                      <td className="py-2 pr-4">
                        <input type="checkbox" checked={day.closed} onChange={e => updateDay(key, 'closed', e.target.checked)}
                          className="w-4 h-4 text-accent rounded" />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="time" value={day.open} disabled={day.closed}
                          onChange={e => updateDay(key, 'open', e.target.value)}
                          className={`input py-1 px-2 text-sm w-28 ${day.closed ? 'opacity-40' : ''}`} />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="time" value={day.close} disabled={day.closed}
                          onChange={e => updateDay(key, 'close', e.target.value)}
                          className={`input py-1 px-2 text-sm w-28 ${day.closed ? 'opacity-40' : ''}`} />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="checkbox" checked={day.lunchBreak} disabled={day.closed}
                          onChange={e => updateDay(key, 'lunchBreak', e.target.checked)}
                          className={`w-4 h-4 text-accent rounded ${day.closed ? 'opacity-40' : ''}`} />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="time" value={day.lunchOpen}
                          disabled={day.closed || !day.lunchBreak}
                          onChange={e => updateDay(key, 'lunchOpen', e.target.value)}
                          className={`input py-1 px-2 text-sm w-28 ${(day.closed || !day.lunchBreak) ? 'opacity-40' : ''}`} />
                      </td>
                      <td className="py-2">
                        <input type="time" value={day.lunchClose}
                          disabled={day.closed || !day.lunchBreak}
                          onChange={e => updateDay(key, 'lunchClose', e.target.value)}
                          className={`input py-1 px-2 text-sm w-28 ${(day.closed || !day.lunchBreak) ? 'opacity-40' : ''}`} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {DAYS.map(({ key, label }) => {
              const day = openingHours[key]
              return (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">{label}</span>
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" checked={day.closed} onChange={e => updateDay(key, 'closed', e.target.checked)}
                        className="w-4 h-4 text-accent rounded" />
                      Gesloten
                    </label>
                  </div>
                  {!day.closed && (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Open</p>
                          <input type="time" value={day.open} onChange={e => updateDay(key, 'open', e.target.value)}
                            className="input py-1 px-2 text-sm w-full" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Sluit</p>
                          <input type="time" value={day.close} onChange={e => updateDay(key, 'close', e.target.value)}
                            className="input py-1 px-2 text-sm w-full" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <input type="checkbox" checked={day.lunchBreak} onChange={e => updateDay(key, 'lunchBreak', e.target.checked)}
                          className="w-4 h-4 text-accent rounded" />
                        Middagsluiting
                      </label>
                      {day.lunchBreak && (
                        <div className="grid grid-cols-2 gap-3 pl-6">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Middag open</p>
                            <input type="time" value={day.lunchOpen} onChange={e => updateDay(key, 'lunchOpen', e.target.value)}
                              className="input py-1 px-2 text-sm w-full" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Middag sluit</p>
                            <input type="time" value={day.lunchClose} onChange={e => updateDay(key, 'lunchClose', e.target.value)}
                              className="input py-1 px-2 text-sm w-full" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* GOLD: Social media */}
      {isGold && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Social media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/jouwpagina' },
              { key: 'instagramUrl', label: 'Instagram', placeholder: 'https://instagram.com/jouwpagina' },
              { key: 'pinterestUrl', label: 'Pinterest', placeholder: 'https://pinterest.com/jouwpagina' },
              { key: 'youtubeUrl', label: 'YouTube', placeholder: 'https://youtube.com/@jouwkanaal' },
              { key: 'tiktokUrl', label: 'TikTok', placeholder: 'https://tiktok.com/@jouwpagina' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="url" value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="input" placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice */}
      <div className="border-t pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.invoiceRequested}
            onChange={e => setForm({ ...form, invoiceRequested: e.target.checked })}
            className="w-5 h-5 text-accent rounded" />
          <span className="font-medium text-gray-900">Ik wens een factuur te ontvangen</span>
        </label>
        {form.invoiceRequested && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Factuurgegevens</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam *</label>
              <input type="text" value={form.invoiceCompanyName}
                onChange={e => setForm({ ...form, invoiceCompanyName: e.target.value })}
                required={form.invoiceRequested} className="input" placeholder="Jouw Bedrijf BV" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BTW-nummer *</label>
              <input type="text" value={form.invoiceVatNumber}
                onChange={e => setForm({ ...form, invoiceVatNumber: e.target.value })}
                required={form.invoiceRequested} className="input" placeholder="BE0123456789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Factuuradres *</label>
              <textarea value={form.invoiceAddress}
                onChange={e => setForm({ ...form, invoiceAddress: e.target.value })}
                required={form.invoiceRequested} rows={2} className="input"
                placeholder={'Straat 123\n1000 Brussel'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email voor factuur *</label>
              <input type="email" value={form.invoiceEmail}
                onChange={e => setForm({ ...form, invoiceEmail: e.target.value })}
                required={form.invoiceRequested} className="input" placeholder="factuur@jouwbedrijf.be" />
            </div>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 text-lg py-4">
        {loading ? 'Verzenden...' : `Aanmelden voor €${price} voor 3 maanden`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Door je aan te melden ga je akkoord met onze voorwaarden.
        Je vermelding wordt actief na ontvangst van de betaling.
      </p>
    </form>
  )
}
