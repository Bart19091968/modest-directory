'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons } from '@/lib/leaflet/fixLeafletIcons'

type Props = {
  shopName: string
  latitude: number
  longitude: number
  addressLine1?: string | null
  addressLine2?: string | null
  postalCode?: string | null
  city?: string | null
  country?: string | null
}

function formatAddress(props: Omit<Props, 'shopName' | 'latitude' | 'longitude'>) {
  return [
    props.addressLine1,
    props.addressLine2,
    [props.postalCode, props.city].filter(Boolean).join(' '),
    props.country,
  ]
    .filter(Boolean)
    .join(', ')
}

export function ShopLocationMap({
  shopName,
  latitude,
  longitude,
  addressLine1,
  addressLine2,
  postalCode,
  city,
  country,
}: Props) {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  const address = formatAddress({ addressLine1, addressLine2, postalCode, city, country })

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          <strong>{shopName}</strong>
          {address && (
            <>
              <br />
              {address}
            </>
          )}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
