export type GeocodingResult = {
  latitude: number
  longitude: number
  displayName: string
  raw: unknown
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const cleaned = address.trim()
  if (!cleaned) return null

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', cleaned)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('countrycodes', 'be,nl,fr')
  url.searchParams.set('email', 'contact@modestdirectory.com')

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'ModestDirectory/1.0 (contact@modestdirectory.com)',
      'Accept-Language': 'nl,en,fr',
    },
  })

  if (!response.ok) {
    throw new Error(`Nominatim request failed: ${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data) || data.length === 0) return null

  const result = data[0]
  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    displayName: result.display_name,
    raw: result,
  }
}
