'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [type, setType] = useState(searchParams.get('type') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (country) params.set('country', country)
    if (type) params.set('type', type)
    
    router.push(`/shops?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    setCountry('')
    setType('')
    router.push('/shops')
  }

  // Apply filters on change (with debounce for search)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query !== (searchParams.get('q') || '')) {
        applyFilters()
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
      <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="label">Zoeken</label>
        <input
          type="text"
          id="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Zoek op naam of stad..."
          className="input"
        />
      </div>

      {/* Country */}
      <div className="mb-6">
        <label className="label">Land</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="country"
              value=""
              checked={country === ''}
              onChange={e => { setCountry(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">Alle landen</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="country"
              value="BE"
              checked={country === 'BE'}
              onChange={e => { setCountry(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">🇧🇪 België</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="country"
              value="NL"
              checked={country === 'NL'}
              onChange={e => { setCountry(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">🇳🇱 Nederland</span>
          </label>
        </div>
      </div>

      {/* Type */}
      <div className="mb-6">
        <label className="label">Type winkel</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value=""
              checked={type === ''}
              onChange={e => { setType(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">Alle types</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="webshop"
              checked={type === 'webshop'}
              onChange={e => { setType(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">🌐 Webshop</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="fysiek"
              checked={type === 'fysiek'}
              onChange={e => { setType(e.target.value); setTimeout(applyFilters, 0) }}
              className="text-accent focus:ring-accent"
            />
            <span className="text-gray-700">🏪 Fysieke winkel</span>
          </label>
        </div>
      </div>

      {/* Clear button */}
      {(query || country || type) && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-gray-600 hover:text-gray-900 text-sm"
        >
          Filters wissen
        </button>
      )}
    </div>
  )
}
