import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query is verplicht' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_PLACES_API_KEY is niet ingesteld in de environment variables' },
      { status: 500 }
    )
  }

  try {
    // Use Google Places API (New) - Text Search
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'nl',
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Google Places API error:', error)
      return NextResponse.json({ error: 'Google API fout' }, { status: 502 })
    }

    const data = await res.json()
    const places = data.places || []

    const results = places.map((place: any) => ({
      placeId: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      reviewCount: place.userRatingCount || null,
      reviewsUrl: place.googleMapsUri || null,    
}))
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Google Places search error:', error)
    return NextResponse.json({ error: 'Zoeken mislukt' }, { status: 500 })
  }
}
