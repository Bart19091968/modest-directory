import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const latitude = Number(body.latitude)
    const longitude = Number(body.longitude)
    const radiusKm = Number(body.radiusKm ?? 25)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json({ error: 'Ongeldige coördinaten' }, { status: 400 })
    }

    const shops = await prisma.$queryRaw<
      { id: string; name: string; slug: string; city: string | null; country: string; latitude: number; longitude: number; distanceKm: number }[]
    >`
      SELECT *
      FROM (
        SELECT
          id,
          name,
          slug,
          city,
          country,
          latitude,
          longitude,
          (
            6371 * acos(
              cos(radians(${latitude}))
              * cos(radians(latitude))
              * cos(radians(longitude) - radians(${longitude}))
              + sin(radians(${latitude}))
              * sin(radians(latitude))
            )
          ) AS "distanceKm"
        FROM "Shop"
        WHERE status = 'APPROVED'
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
      ) AS nearby
      WHERE "distanceKm" <= ${radiusKm}
      ORDER BY "distanceKm" ASC
      LIMIT 50
    `

    return NextResponse.json({ shops })
  } catch (error) {
    console.error('Nearby search error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
