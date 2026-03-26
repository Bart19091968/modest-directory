'use client'

import { useState, useEffect } from 'react'

interface AdPlacement {
  id: string
  slot: string
  type: string
  code: string | null
  isActive: boolean
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdPlacement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    const res = await fetch('/api/admin/ads')
    if (res.ok) {
      const data = await res.json()
      setAds(data)
    }
    setLoading(false)
  }

  const handleUpdate = async (id: string, code: string, isActive: boolean) => {
    setSaving(id)
    await fetch('/api/admin/ads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, code, isActive }),
    })
    await fetchAds()
    setSaving(null)
  }

  if (loading) {
    return <div className="text-center py-8">Laden...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Advertenties beheren</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>AdSense instellen:</strong> Plak je AdSense code in het tekstveld en zet de advertentie op actief. 
          De code wordt automatisch weergegeven op de juiste plekken op de site.
        </p>
      </div>

      <div className="space-y-6">
        {ads.map(ad => (
          <AdPlacementCard 
            key={ad.id} 
            ad={ad} 
            onUpdate={handleUpdate}
            saving={saving === ad.id}
          />
        ))}
      </div>
    </div>
  )
}

function AdPlacementCard({ 
  ad, 
  onUpdate, 
  saving 
}: { 
  ad: AdPlacement
  onUpdate: (id: string, code: string, isActive: boolean) => void
  saving: boolean
}) {
  const [code, setCode] = useState(ad.code || '')
  const [isActive, setIsActive] = useState(ad.isActive)

  const slotNames: Record<string, string> = {
    'homepage-header': 'Homepage Header',
    'sidebar-top': 'Sidebar Boven',
    'sidebar-bottom': 'Sidebar Onder',
    'listings-inline': 'Tussen Listings',
    'footer-banner': 'Footer Banner',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{slotNames[ad.slot] || ad.slot}</h3>
          <p className="text-sm text-gray-500">Slot: {ad.slot}</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-accent rounded"
          />
          <span className="text-sm text-gray-700">Actief</span>
        </label>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={4}
        className="w-full px-4 py-2 border rounded-lg font-mono text-sm mb-4"
        placeholder="Plak hier je AdSense code..."
      />

      <button
        onClick={() => onUpdate(ad.id, code, isActive)}
        disabled={saving}
        className="btn-primary disabled:opacity-50"
      >
        {saving ? 'Opslaan...' : 'Opslaan'}
      </button>
    </div>
  )
}
