import { NextResponse } from 'next/server'
import { geocodeAddress } from '@/lib/geocoding/nominatim'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const query = String(body.query ?? '').trim()

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Vul een stad of postcode in.' },
        { status: 400 }
      )
    }

    const result = await geocodeAddress(query)

    if (!result) {
      return NextResponse.json(
        { error: 'Locatie niet gevonden. Probeer een andere stad of postcode.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      latitude: result.latitude,
      longitude: result.longitude,
      displayName: result.displayName,
    })
  } catch {
    return NextResponse.json(
      { error: 'Geocoding-service tijdelijk niet beschikbaar.' },
      { status: 500 }
    )
  }
}
