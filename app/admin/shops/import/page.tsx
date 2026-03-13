'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportShopsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const file = formData.get('csvFile') as File

    if (!file || file.size === 0) {
      setError('Selecteer een CSV bestand')
      setLoading(false)
      return
    }

    const text = await file.text()

    try {
      const res = await fetch('/api/admin/shops/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Er ging iets mis')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Winkels importeren</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold mb-4">CSV Formaat</h2>
        <p className="text-sm text-gray-600 mb-4">
          Je CSV moet de volgende kolommen bevatten (eerste rij = headers):
        </p>
        <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
          name,shortDescription,city,country,websiteUrl,email,isPhysicalStore,isWebshop
        </div>
        <ul className="mt-4 text-sm text-gray-600 space-y-1">
          <li><strong>name</strong> - Naam van de winkel (verplicht)</li>
          <li><strong>shortDescription</strong> - Korte beschrijving, max 200 tekens (verplicht)</li>
          <li><strong>city</strong> - Stad (optioneel)</li>
          <li><strong>country</strong> - BE of NL (standaard: BE)</li>
          <li><strong>websiteUrl</strong> - Website URL (optioneel)</li>
          <li><strong>email</strong> - Email adres (optioneel)</li>
          <li><strong>isPhysicalStore</strong> - true/false (standaard: false)</li>
          <li><strong>isWebshop</strong> - true/false (standaard: true)</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold mb-4">Voorbeeld CSV</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre">
{`name,shortDescription,city,country,websiteUrl,email,isPhysicalStore,isWebshop
Hijab House,Mooie hijabs en accessoires,Amsterdam,NL,https://hijabhouse.nl,info@hijabhouse.nl,false,true
Modest Fashion Store,Abaya's en modest kleding,Brussel,BE,https://modestfashion.be,,true,true`}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          <p className="font-semibold">{result.success} winkels geïmporteerd!</p>
          {result.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Fouten:</p>
              <ul className="text-sm list-disc list-inside">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
            CSV Bestand
          </label>
          <input
            type="file"
            id="csvFile"
            name="csvFile"
            accept=".csv"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Importeren...' : 'Importeer winkels'}
          </button>
          
            <a href="/admin/shops"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </a>
        </div>
      </form>
    </div>
  )
}