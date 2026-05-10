import { NextResponse } from 'next/server'
import { geocodeAddress } from '@/lib/geocoding/nominatim'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const address = String(body.address ?? '').trim()

    if (address.length < 5) {
      return NextResponse.json(
        { error: 'Vul eerst een adres, postcode, stad en land in.' },
        { status: 400 }
      )
    }

    const result = await geocodeAddress(address)

    if (!result) {
      return NextResponse.json(
        {
          error: 'Geen coördinaten gevonden voor dit adres. Controleer de spelling of vul de coördinaten manueel in.',
          geocodingStatus: 'failed',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      latitude: result.latitude,
      longitude: result.longitude,
      geocodedAddress: result.displayName,
      geocodingStatus: 'success',
    })
  } catch {
    return NextResponse.json(
      {
        error: 'De geocoding-service is tijdelijk niet beschikbaar. Probeer later opnieuw of vul de coördinaten manueel in.',
        geocodingStatus: 'failed',
      },
      { status: 500 }
    )
  }
}
