'use client'

import { useState, useEffect, useRef } from 'react'

const MAX_WIDTH = 1920
const MAX_HEIGHT = 800
const QUALITY = 0.85

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', QUALITY))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function AdminSettingsPage() {
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [compressing, setCompressing] = useState(false)
  const [fileInfo, setFileInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((settings: { key: string; value: string }[]) => {
        const hero = settings.find(s => s.key === 'heroImageUrl')
        if (hero) setHeroImageUrl(hero.value)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCompressing(true)
    setFileInfo(null)
    try {
      const compressed = await compressImage(file)
      // Estimate size in KB
      const sizeKb = Math.round((compressed.length * 3) / 4 / 1024)
      setHeroImageUrl(compressed)
      setFileInfo(`${file.name} — verkleind naar ~${sizeKb} KB`)
    } catch {
      alert('Kon de afbeelding niet verwerken. Probeer een ander bestand.')
    } finally {
      setCompressing(false)
    }
  }

  async function handleSave() {
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
    setFileInfo(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
          Upload een afbeelding voor de achtergrond van de hero-banner op de homepage.
          Beste formaat: breed landschapsformaat (bijv. 1920×600 px, max 5 MB).
          De afbeelding wordt automatisch verkleind en gecomprimeerd.
          Zonder afbeelding wordt de standaard kleurgradiënt gebruikt.
        </p>

        {loading ? (
          <p className="text-gray-400 text-sm">Laden...</p>
        ) : (
          <div className="space-y-5">
            {/* Upload zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afbeelding uploaden
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition">
                <div className="text-center px-4">
                  {compressing ? (
                    <p className="text-sm text-accent">Afbeelding wordt verwerkt...</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-accent">Klik om te uploaden</span> of sleep een bestand hierheen
                      </p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5 MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {fileInfo && (
                <p className="text-xs text-green-600 mt-1">✓ {fileInfo}</p>
              )}
            </div>

            {/* Preview */}
            {heroImageUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Voorbeeld (zoals op de homepage):</p>
                <div className="relative rounded-lg overflow-hidden h-44 bg-gray-100">
                  <img
                    src={heroImageUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                    <p className="text-white font-bold text-xl">Islamitische Kledingwinkels</p>
                    <p className="text-white/80 text-sm">in Nederland &amp; België</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 items-center">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || compressing || !heroImageUrl}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Verwijderen
                </button>
              )}
              {saved && (
                <span className="text-green-600 text-sm">✓ Opgeslagen</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
