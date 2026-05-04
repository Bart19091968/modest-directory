'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

type CityOption = {
  name: string
  slug: string
}

type Props = {
  citiesBE: CityOption[]
  citiesNL: CityOption[]
}

export default function ShopSearchBar({ citiesBE, citiesNL }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = useState(searchParams.get('search') || '')

  // Local state for immediate visual feedback on checkboxes
  const [webshopChecked, setWebshopChecked] = useState(() => {
    const t = searchParams.get('type') || ''
    return !t || t.includes('webshop')
  })
  const [physicalChecked, setPhysicalChecked] = useState(() => {
    const t = searchParams.get('type') || ''
    return !t || t.includes('physical')
  })
  // Uitgelicht: opt-in filter — unchecked by default, checked = only featured
  const [featuredChecked, setFeaturedChecked] = useState(
    () => searchParams.get('featured') === '1'
  )

  // Sync local checkbox state when URL changes (e.g. browser back/forward)
  useEffect(() => {
    const t = searchParams.get('type') || ''
    setWebshopChecked(!t || t.includes('webshop'))
    setPhysicalChecked(!t || t.includes('physical'))
    setFeaturedChecked(searchParams.get('featured') === '1')
  }, [searchParams])

  const country = searchParams.get('country') || ''
  const city = searchParams.get('city') || ''

  const visibleCities = country === 'BE'
    ? citiesBE
    : country === 'NL'
      ? citiesNL
      : [...citiesBE, ...citiesNL].sort((a, b) => a.name.localeCompare(b.name))

  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    router.push(`/shops?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    pushParams({ search: name || null })
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    const valid = next === 'BE' ? citiesBE : next === 'NL' ? citiesNL : [...citiesBE, ...citiesNL]
    const cityStillValid = city && valid.some(c => c.slug === city)
    pushParams({ country: next || null, city: cityStillValid ? city : null })
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    pushParams({ city: e.target.value || null })
  }

  const handleWebshopChange = (checked: boolean) => {
    setWebshopChecked(checked)
    const nextWebshop = checked
    const nextPhysical = physicalChecked
    let typeParam: string | null = null
    if (nextWebshop && !nextPhysical) typeParam = 'webshop'
    else if (!nextWebshop && nextPhysical) typeParam = 'physical'
    // both checked or both unchecked → no type filter
    pushParams({ type: typeParam })
  }

  const handlePhysicalChange = (checked: boolean) => {
    setPhysicalChecked(checked)
    const nextWebshop = webshopChecked
    const nextPhysical = checked
    let typeParam: string | null = null
    if (nextWebshop && !nextPhysical) typeParam = 'webshop'
    else if (!nextWebshop && nextPhysical) typeParam = 'physical'
    pushParams({ type: typeParam })
  }

  const handleFeaturedChange = (checked: boolean) => {
    setFeaturedChecked(checked)
    // checked = opt-in filter: show only featured shops
    pushParams({ featured: checked ? '1' : null })
  }

  const fieldClass =
    'h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors'

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Zoek op naam..."
          className={`${fieldClass} flex-1 min-w-0`}
        />
        <select
          value={country}
          onChange={handleCountryChange}
          className={`${fieldClass} sm:w-40`}
        >
          <option value="">Alle landen</option>
          <option value="NL">Nederland</option>
          <option value="BE">België</option>
        </select>
        <select
          value={city}
          onChange={handleCityChange}
          className={`${fieldClass} sm:w-48`}
        >
          <option value="">Alle steden</option>
          {visibleCities.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 px-6 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors whitespace-nowrap shrink-0"
        >
          Zoeken
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-6 mt-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={featuredChecked}
            onChange={e => handleFeaturedChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-gray-900"
          />
          <span className="text-sm text-gray-600">Uitgelicht</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={webshopChecked}
            onChange={e => handleWebshopChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-gray-900"
          />
          <span className="text-sm text-gray-600">Webshop</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={physicalChecked}
            onChange={e => handlePhysicalChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 accent-gray-900"
          />
          <span className="text-sm text-gray-600">Fysieke winkel</span>
        </label>
      </div>
    </div>
  )
}
