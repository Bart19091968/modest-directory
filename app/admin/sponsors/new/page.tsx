'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSponsorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      bannerUrl: formData.get('bannerUrl'),
      linkUrl: formData.get('linkUrl'),
      position: formData.get('position'),
      isActive: formData.get('isActive') === 'on',
      endDate: formData.get('endDate') || null,
    }

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Er ging iets mis')
      }

      router.push('/admin/sponsors')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Nieuwe sponsor</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Naam *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Banner URL *
          </label>
          <input
            type="url"
            id="bannerUrl"
            name="bannerUrl"
            required
            placeholder="https://example.com/banner.jpg"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Header: 728x90px | Sidebar: 300x250px
          </p>
        </div>

        <div>
          <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Link URL *
          </label>
          <input
            type="url"
            id="linkUrl"
            name="linkUrl"
            required
            placeholder="https://sponsor-website.com"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Positie *
          </label>
          <select
            id="position"
            name="position"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="HEADER">Header (boven hero)</option>
            <option value="SIDEBAR">Sidebar (naast winkels)</option>
            <option value="FOOTER">Footer (onderaan)</option>
          </select>
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            Einddatum (optioneel)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Laat leeg voor onbeperkte duur
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Direct actief
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Opslaan...' : 'Sponsor toevoegen'}
          </button>
          
            href="/admin/sponsors"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </a>
        </div>
      </form>
    </div>
  )
}