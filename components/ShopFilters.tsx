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
  activeCountry?: string
  activeCity?: string
  activeType?: string
  activeCategory?: string
  activeSearch?: string
}

export default function ShopFilters({
  categories,
  citiesBE,
  citiesNL,
  activeCountry,
  activeCity,
  activeType,
  activeCategory,
  activeSearch,
}: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(activeSearch || '')

  const buildUrl = useCallback((overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()

    const values: Record<string, string | undefined> = {
      search: activeSearch,
      country: activeCountry,
      city: activeCity,
      type: activeType,
      category: activeCategory,
      ...overrides,
    }

    // If country changes, clear city
    if ('country' in overrides && overrides.country !== activeCountry) {
      values.city = undefined
    }

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    return `/shops?${params.toString()}`
  }, [activeSearch, activeCountry, activeCity, activeType, activeCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(buildUrl({ search: search || undefined }))
  }

  const navigate = (overrides: Record<string, string | undefined>) => {
    router.push(buildUrl(overrides))
  }

  // Determine which cities to show based on selected country
  const visibleCities = activeCountry === 'BE'
    ? citiesBE
    : activeCountry === 'NL'
      ? citiesNL
      : [...citiesBE, ...citiesNL].sort((a, b) => a.name.localeCompare(b.name))

  const hasActiveFilters = activeCountry || activeCity || activeType || activeCategory || activeSearch

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zoek op naam of stad..."
              className="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <a
          href="/shops"
          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Alle filters wissen
        </a>
      )}

      {/* Country filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Land</h3>
        <div className="space-y-1">
          {[
            { value: undefined, label: 'Alle landen' },
            { value: 'BE', label: '🇧🇪 België' },
            { value: 'NL', label: '🇳🇱 Nederland' },
          ].map(option => (
            <button
              key={option.label}
              onClick={() => navigate({ country: option.value })}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCountry === option.value || (!activeCountry && !option.value)
                  ? 'bg-accent text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Type</h3>
        <div className="space-y-1">
          {[
            { value: undefined, label: 'Alle types' },
            { value: 'webshop', label: '🌐 Webshop' },
            { value: 'physical', label: '🏪 Fysieke winkel' },
          ].map(option => (
            <button
              key={option.label}
              onClick={() => navigate({ type: option.value })}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeType === option.value || (!activeType && !option.value)
                  ? 'bg-accent text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Categorie</h3>
          <div className="space-y-1">
            <button
              onClick={() => navigate({ category: undefined })}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCategory
                  ? 'bg-accent text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Alle categorieën
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate({ category: cat.slug })}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-accent text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City filter */}
      {visibleCities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Stad</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            <button
              onClick={() => navigate({ city: undefined })}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCity
                  ? 'bg-accent text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Alle steden
            </button>
            {visibleCities.map(city => (
              <button
                key={city.slug}
                onClick={() => navigate({ city: city.slug })}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCity === city.slug
                    ? 'bg-accent text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
