'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getUserCoordinates, type GeolocationError } from '@/lib/location/getUserCoordinates'

type NearbyShop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  city: string | null
  country: string
  latitude: number
  longitude: number
  logoUrl: string | null
  isPhysicalStore: boolean
  isWebshop: boolean
  subscriptionTier: string | null
  distanceKm: number
}

const RADIUS_OPTIONS = [5, 10, 25, 50, 100]

const GEO_ERROR_MESSAGES: Record<GeolocationError, string> = {
  permission_denied:
    'Locatietoegang geweigerd. Geef toestemming in je browserinstellingen of gebruik de stad/postcode-zoekopdracht hieronder.',
  position_unavailable:
    'Je locatie kon niet worden bepaald. Probeer het opnieuw of gebruik de stad/postcode-zoekopdracht.',
  timeout:
    'Het ophalen van je locatie duurde te lang. Probeer het opnieuw.',
  not_supported:
    'Je browser ondersteunt geen geolocatie. Gebruik de stad/postcode-zoekopdracht.',
}

export default function NearbyShopsSearch() {
  const [radiusKm, setRadiusKm] = useState(25)
  const [locationQuery, setLocationQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [shops, setShops] = useState<NearbyShop[] | null>(null)
  const [resolvedLocation, setResolvedLocation] = useState<string | null>(null)

  async function searchNearby(latitude: number, longitude: number, locationLabel: string) {
    setLoading(true)
    setGeoError(null)
    setShops(null)
    setResolvedLocation(locationLabel)

    try {
      const res = await fetch('/api/shops/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude, radiusKm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setShops(data.shops)
    } catch {
      setGeoError('Er ging iets mis bij het ophalen van winkels. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGeolocate() {
    setLoading(true)
    setGeoError(null)
    setShops(null)
    setResolvedLocation(null)

    try {
      const coords = await getUserCoordinates()
      await searchNearby(coords.latitude, coords.longitude, 'je huidige locatie')
    } catch (err) {
      setLoading(false)
      setGeoError(GEO_ERROR_MESSAGES[err as GeolocationError] ?? GEO_ERROR_MESSAGES.position_unavailable)
    }
  }

  async function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = locationQuery.trim()
    if (!q) return

    setLoading(true)
    setGeoError(null)
    setShops(null)

    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await searchNearby(data.latitude, data.longitude, q)
    } catch (err) {
      setLoading(false)
      setGeoError(err instanceof Error ? err.message : 'Locatie niet gevonden.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card p-6 space-y-4">
        {/* Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zoekradius</label>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map(r => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  radiusKm === r
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-accent hover:text-accent'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Geolocate button */}
        <div>
          <button
            onClick={handleGeolocate}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {loading ? 'Bezig...' : 'Gebruik mijn locatie'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          <span>of zoek op stad / postcode</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* City/postcode fallback */}
        <form onSubmit={handleLocationSearch} className="flex gap-2">
          <input
            type="text"
            value={locationQuery}
            onChange={e => setLocationQuery(e.target.value)}
            placeholder="bijv. Antwerpen of 2000"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !locationQuery.trim()}
            className="btn-primary px-5 disabled:opacity-60"
          >
            Zoek
          </button>
        </form>
      </div>

      {/* Error */}
      {geoError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {geoError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p>Winkels zoeken in de buurt...</p>
        </div>
      )}

      {/* Results */}
      {!loading && shops !== null && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {shops.length === 0
              ? `Geen winkels gevonden binnen ${radiusKm} km van ${resolvedLocation}.`
              : `${shops.length} winkel${shops.length !== 1 ? 's' : ''} gevonden binnen ${radiusKm} km van ${resolvedLocation}.`}
          </p>

          {shops.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {shops.map(shop => (
                <NearbyShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NearbyShopCard({ shop }: { shop: NearbyShop }) {
  const firstLetter = shop.name.charAt(0).toUpperCase()
  const distanceLabel =
    shop.distanceKm < 1
      ? `${Math.round(shop.distanceKm * 1000)} m`
      : `${shop.distanceKm.toFixed(1)} km`

  return (
    <Link href={`/shops/${shop.slug}`} className="card p-4 block hover:shadow-md transition">
      <div className="flex gap-3 mb-2">
        <div className="flex-shrink-0">
          {shop.subscriptionTier && shop.logoUrl ? (
            <Image
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-lg font-bold text-accent">{firstLetter}</span>
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{shop.city || shop.country}</span>
            <span>·</span>
            <span className="text-accent font-medium">{distanceLabel}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{shop.shortDescription}</p>

      <div className="flex flex-wrap gap-1">
        {shop.isWebshop && (
          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">Webshop</span>
        )}
        {shop.isPhysicalStore && (
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">Fysieke winkel</span>
        )}
      </div>
    </Link>
  )
}
