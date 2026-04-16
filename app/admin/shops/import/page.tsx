'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ImportResult {
  success: boolean
  created: number
  skipped: number
  errors: number
  details: {
    created: string[]
    skipped: string[]
    errors: string[]
  }
}

export default function ImportShopsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/shops/import', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Import mislukt')
      }
    } catch (err) {
      setError('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Winkels importeren (CSV)</h1>
        <Link href="/admin/shops" className="text-gray-600 hover:text-gray-800">
          ← Terug
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">CSV Formaat</h3>
        <p className="text-sm text-blue-700 mb-2">
          Je CSV bestand moet de volgende kolommen hebben (header verplicht):
        </p>
        <code className="block bg-blue-100 p-2 rounded text-xs text-blue-800 overflow-x-auto">
          name,shortDescription,city,country,websiteUrl,email,isPhysicalStore,isWebshop,address,phone
        </code>
        <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
          <li><strong>name</strong> - Verplicht</li>
          <li><strong>shortDescription</strong> - Optioneel (max 200 tekens)</li>
          <li><strong>city</strong> - Optioneel (bijv. Amsterdam)</li>
          <li><strong>country</strong> - Optioneel (NL of BE, standaard: NL)</li>
          <li><strong>websiteUrl</strong> - Optioneel</li>
          <li><strong>email</strong> - Optioneel</li>
          <li><strong>isPhysicalStore</strong> - Optioneel (true/false)</li>
          <li><strong>isWebshop</strong> - Optioneel (true/false, standaard: true)</li>
          <li><strong>address</strong> - Optioneel (straat + huisnummer)</li>
          <li><strong>phone</strong> - Optioneel (telefoonnummer)</li>
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Import voltooid!</h3>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-700">{result.created}</p>
              <p className="text-sm text-green-600">Aangemaakt</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3">
              <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
              <p className="text-sm text-yellow-600">Overgeslagen</p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-700">{result.errors}</p>
              <p className="text-sm text-red-600">Fouten</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV Bestand
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-3">
          <Link href="/admin/shops" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
            Annuleren
          </Link>
          <button
            type="submit"
            disabled={!file || loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Importeren...' : 'Importeren'}
          </button>
        </div>
      </form>
    </div>
  )
}
