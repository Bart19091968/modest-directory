'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons } from '@/lib/leaflet/fixLeafletIcons'

export type ShopMarker = {
  id: string
  name: string
  slug: string
  latitude: number
  longitude: number
  distanceKm: number
  city?: string | null
  country?: string | null
}

function getZoomForRadius(radiusKm: number) {
  if (radiusKm <= 5) return 13
  if (radiusKm <= 10) return 12
  if (radiusKm <= 25) return 10
  if (radiusKm <= 50) return 9
  return 8
}

function FitMapToSearchArea({
  userLatitude,
  userLongitude,
  radiusKm,
  shops,
}: {
  userLatitude: number
  userLongitude: number
  radiusKm: number
  shops: ShopMarker[]
}) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = [
      [userLatitude, userLongitude],
      ...shops.map(s => [s.latitude, s.longitude] as [number, number]),
    ]

    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 14 })
    } else {
      map.setView([userLatitude, userLongitude], getZoomForRadius(radiusKm))
    }
  }, [map, userLatitude, userLongitude, radiusKm, shops])

  return null
}

export function NearbyShopsMap({
  userLatitude,
  userLongitude,
  radiusKm,
  shops,
  locationLabel,
}: {
  userLatitude: number
  userLongitude: number
  radiusKm: number
  shops: ShopMarker[]
  locationLabel?: string
}) {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  return (
    <MapContainer
      center={[userLatitude, userLongitude]}
      zoom={getZoomForRadius(radiusKm)}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitMapToSearchArea
        userLatitude={userLatitude}
        userLongitude={userLongitude}
        radiusKm={radiusKm}
        shops={shops}
      />

      {/* Gebruikerslocatie-marker */}
      <Marker position={[userLatitude, userLongitude]}>
        <Popup>{locationLabel ?? 'Jouw locatie'}</Popup>
      </Marker>

      {/* Zoekradius-cirkel */}
      <Circle
        center={[userLatitude, userLongitude]}
        radius={radiusKm * 1000}
        pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.06, weight: 2 }}
      />

      {/* Winkelmarkers */}
      {shops.map(shop => (
        <Marker key={shop.id} position={[shop.latitude, shop.longitude]}>
          <Popup>
            <strong>{shop.name}</strong>
            <br />
            {shop.city ? `${shop.city}, ` : ''}{shop.country ?? ''}
            <br />
            {shop.distanceKm.toFixed(1)} km van jou
            <br />
            <a href={`/shops/${shop.slug}`} className="text-indigo-600 hover:underline">
              Bekijk winkel
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
