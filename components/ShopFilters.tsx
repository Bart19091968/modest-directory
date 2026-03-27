'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'

type Category = {
  id: string
  name: string
  slug: string
  icon: string | null
}

type CityOption = {
  name: string
  slug: string
}

type Props = {
  categories: Category[]
  citiesBE: CityOption[]
  citiesNL: CityOption[]
}

export default function ShopFilters({ categories, citiesBE, citiesNL }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Parse multi-value params (comma-separated)
  const activeCountries = searchParams.get('country')?.split(',').filter(Boolean) || []
  const activeTypes = searchParams.get('type')?.split(',').filter(Boolean) || []
  const activeCategories = searchParams.get('category')?.split(',').filter(Boolean) || []
  const activeCities = searchParams.get('city')?.split(',').filter(Boolean) || []

  const toggleParam = useCallback((key: string, value: string, currentValues: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    let newValues: string[]

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    if (newValues.length === 0) {
      params.delete(key)
    } else {
      params.set(key, newValues.join(','))
    }

    // If country changes, clear cities that no longer apply
    if (key === 'country') {
      const selectedCountries = newValues
      const validCities = [
        ...(selectedCountries.includes('BE') || selectedCountries.length === 0 ? citiesBE : []),
        ...(selectedCountries.includes('NL') || selectedCountries.length === 0 ? citiesNL : []),
      ].map(c => c.slug)

      const currentCities = params.get('city')?.split(',').filter(Boolean) || []
      const filteredCities = currentCities.filter(c => validCities.includes(c))
      if (filteredCities.length === 0) {
        params.delete('city')
      } else {
        params.set('city', filteredCities.join(','))
      }
    }

    router.push(`/shops?${params.toString()}`)
  }, [searchParams, router, citiesBE, citiesNL])

  const clearAll = () => {
    const params = new URLSearchParams()
    const search = searchParams.get('search')
    if (search) params.set('search', search)
    router.push(`/shops?${params.toString()}`)
  }

  const hasActiveFilters = activeCountries.length > 0 || activeTypes.length > 0 || activeCategories.length > 0 || activeCities.length > 0

  // Show cities based on selected countries
  const visibleCities = (() => {
    const cities: CityOption[] = []
    if (activeCountries.length === 0 || activeCountries.includes('BE')) {
      cities.push(...citiesBE)
    }
    if (activeCountries.length === 0 || activeCountries.includes('NL')) {
      cities.push(...citiesNL)
    }
    return cities.sort((a, b) => a.name.localeCompare(b.name))
  })()

  const filterContent = (
    <div className="space-y-5">
      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Filters wissen
        </button>
      )}

      {/* Country */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Land</h3>
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={activeCountries.includes('BE')}
            onChange={() => toggleParam('country', 'BE', activeCountries)}
            className="w-4 h-4 text-accent rounded focus:ring-accent"
          />
          <span className="text-sm text-gray-700">🇧🇪 België</span>
        </label>
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={activeCountries.includes('NL')}
            onChange={() => toggleParam('country', 'NL', activeCountries)}
            className="w-4 h-4 text-accent rounded focus:ring-accent"
          />
          <span className="text-sm text-gray-700">🇳🇱 Nederland</span>
        </label>
      </div>

      {/* Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Type</h3>
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={activeTypes.includes('webshop')}
            onChange={() => toggleParam('type', 'webshop', activeTypes)}
            className="w-4 h-4 text-accent rounded focus:ring-accent"
          />
          <span className="text-sm text-gray-700">🌐 Webshop</span>
        </label>
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={activeTypes.includes('physical')}
            onChange={() => toggleParam('type', 'physical', activeTypes)}
            className="w-4 h-4 text-accent rounded focus:ring-accent"
          />
          <span className="text-sm text-gray-700">🏪 Fysieke winkel</span>
        </label>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Categorie</h3>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeCategories.includes(cat.slug)}
                onChange={() => toggleParam('category', cat.slug, activeCategories)}
                className="w-4 h-4 text-accent rounded focus:ring-accent"
              />
              <span className="text-sm text-gray-700">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      )}

      {/* City */}
      {visibleCities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Stad</h3>
          <div className="max-h-48 overflow-y-auto space-y-0">
            {visibleCities.map(city => (
              <label key={city.slug} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeCities.includes(city.slug)}
                  onChange={() => toggleParam('city', city.slug, activeCities)}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <span className="text-sm text-gray-700">{city.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {filterContent}
      </div>

      {/* Mobile: collapsible button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-lg text-sm font-medium text-gray-700"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeCountries.length + activeTypes.length + activeCategories.length + activeCities.length}
              </span>
            )}
          </span>
          <svg className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-3 p-4 bg-white border rounded-lg">
            {filterContent}
          </div>
        )}
      </div>
    </>
  )
}
