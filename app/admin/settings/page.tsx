'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((settings: { key: string; value: string }[]) => {
        const hero = settings.find(s => s.key === 'heroImageUrl')
        if (hero) setHeroImageUrl(hero.value)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'heroImageUrl', value: heroImageUrl }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleClear() {
    setHeroImageUrl('')
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'heroImageUrl', value: '' }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site-instellingen</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Hero banner afbeelding</h2>
        <p className="text-sm text-gray-500 mb-6">
          Voer een afbeeldings-URL in om de homepagina hero-banner een achtergrondafbeelding te geven.
          Laat leeg om de standaard kleurgradiënt te gebruiken.
          Gebruik een brede afbeelding (minimaal 1920×600 px) voor het beste resultaat op pc en mobiel.
        </p>

        {loading ? (
          <p className="text-gray-400 text-sm">Laden...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Afbeeldings-URL
              </label>
              <input
                type="url"
                value={heroImageUrl}
                onChange={e => setHeroImageUrl(e.target.value)}
                placeholder="https://example.com/hero-banner.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none text-sm"
              />
            </div>

            {heroImageUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Voorbeeld:</p>
                <div className="relative rounded-lg overflow-hidden h-40 bg-gray-100">
                  <img
                    src={heroImageUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-bold text-lg">Islamitische Kledingwinkels</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-6"
              >
                {saving ? 'Opslaan...' : 'Opslaan'}
              </button>
              {heroImageUrl && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Verwijderen (gebruik gradiënt)
                </button>
              )}
              {saved && (
                <span className="text-green-600 text-sm flex items-center">✓ Opgeslagen</span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
