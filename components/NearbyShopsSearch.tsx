'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { getUserCoordinates, type GeolocationError } from '@/lib/location/getUserCoordinates'
import type { ShopMarker } from '@/components/nearby/NearbyShopsMap'

// Dynamic import — Leaflet gebruikt window en werkt niet server-side
const NearbyShopsMap = dynamic(
  () => import('@/components/nearby/NearbyShopsMap').then(mod => mod.NearbyShopsMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-sm text-gray-500">Kaart laden...</p>
      </div>
    ),
  }
)

type NearbyShop = ShopMarker & {
  shortDescription: string
  isPhysicalStore: boolean
  isWebshop: boolean
  subscriptionTier: string | null
  logoUrl: string | null
}

type UserLocation = {
  latitude: number
  longitude: number
  label: string
}

const RADIUS_OPTIONS = [5, 10, 25, 50, 100]

const GEO_ERROR_MESSAGES: Record<GeolocationError, string> = {
  permission_denied:
    'Locatietoegang geweigerd. Geef toestemming in je browserinstellingen of gebruik de stad/postcode-zoekopdracht.',
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
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [shops, setShops] = useState<NearbyShop[] | null>(null)

  async function fetchShops(lat: number, lng: number, radius: number) {
    setLoading(true)
    setGeoError(null)
    setShops(null)
    try {
      const res = await fetch('/api/shops/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng, radiusKm: radius }),
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
    setUserLocation(null)
    try {
      const coords = await getUserCoordinates()
      const loc: UserLocation = { latitude: coords.latitude, longitude: coords.longitude, label: 'Jouw locatie' }
      setUserLocation(loc)
      await fetchShops(coords.latitude, coords.longitude, radiusKm)
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
    setUserLocation(null)
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const loc: UserLocation = { latitude: data.latitude, longitude: data.longitude, label: `Gekozen locatie: ${q}` }
      setUserLocation(loc)
      await fetchShops(data.latitude, data.longitude, radiusKm)
    } catch (err) {
      setLoading(false)
      setGeoError(err instanceof Error ? err.message : 'Locatie niet gevonden.')
    }
  }

  async function handleRadiusChange(r: number) {
    setRadiusKm(r)
    if (userLocation) {
      await fetchShops(userLocation.latitude, userLocation.longitude, r)
    }
  }

  return (
    <div className="space-y-6">
      {/* Zoekblok */}
      <div className="card p-6 space-y-4">
        {/* Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zoekradius</label>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map(r => (
              <button
                key={r}
                onClick={() => handleRadiusChange(r)}
                aria-pressed={radiusKm === r}
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

        {/* GPS-knop */}
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

        {/* Scheidingslijn */}
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-200" />
          <span>of zoek op stad / postcode</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Stad/postcode */}
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

      {/* Foutmelding */}
      {geoError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {geoError}
        </div>
      )}

      {/* Laden */}
      {loading && (
        <div className="text-center py-10 text-gray-500" aria-live="polite">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-3" />
          <p>Winkels in jouw buurt worden gezocht...</p>
        </div>
      )}

      {/* Resultaten + kaart */}
      {!loading && shops !== null && userLocation && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Resultatenlijst */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 mb-4">
              {shops.length === 0
                ? `Geen winkels gevonden binnen ${radiusKm} km.`
                : `${shops.length} winkel${shops.length !== 1 ? 's' : ''} gevonden binnen ${radiusKm} km.`}
            </p>

            {shops.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                <p className="mb-4">Probeer een grotere zoekradius.</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {radiusKm < 25 && (
                    <button onClick={() => handleRadiusChange(25)} className="btn-primary text-sm">
                      Zoek binnen 25 km
                    </button>
                  )}
                  {radiusKm < 50 && (
                    <button onClick={() => handleRadiusChange(50)} className="btn-primary text-sm">
                      Zoek binnen 50 km
                    </button>
                  )}
                  {radiusKm < 100 && (
                    <button onClick={() => handleRadiusChange(100)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                      Zoek binnen 100 km
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {shops.map(shop => (
                  <li key={shop.id}>
                    <NearbyShopCard shop={shop} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Kaart — sticky op desktop */}
          <div className="lg:w-[420px] flex-shrink-0">
            <div
              className="rounded-lg overflow-hidden shadow lg:sticky"
              style={{ height: '500px', top: '96px' }}
            >
              <NearbyShopsMap
                userLatitude={userLocation.latitude}
                userLongitude={userLocation.longitude}
                radiusKm={radiusKm}
                shops={shops}
                locationLabel={userLocation.label}
              />
            </div>
          </div>
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

  const storeTypeLabel =
    shop.isPhysicalStore && shop.isWebshop
      ? 'Fysieke winkel + webshop'
      : shop.isPhysicalStore
      ? 'Fysieke winkel'
      : shop.isWebshop
      ? 'Webshop'
      : null

  return (
    <Link href={`/shops/${shop.slug}`} className="card p-4 flex gap-4 hover:shadow-md transition">
      <div className="flex-shrink-0">
        {shop.subscriptionTier && shop.logoUrl ? (
          <Image
            src={shop.logoUrl}
            alt={`${shop.name} logo`}
            width={56}
            height={56}
            className="w-14 h-14 rounded-lg object-cover border"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-accent">{firstLetter}</span>
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
          <span className="text-accent font-medium text-sm flex-shrink-0">{distanceLabel}</span>
        </div>
        <p className="text-xs text-gray-500 mb-1">
          {shop.city ? `${shop.city}${shop.country ? `, ${shop.country}` : ''}` : shop.country}
        </p>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{shop.shortDescription}</p>
        {storeTypeLabel && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {storeTypeLabel}
          </span>
        )}
      </div>
    </Link>
  )
}
