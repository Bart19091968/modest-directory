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

    // Bounding box pre-filter to avoid full table scan
    const deltaLat = radiusKm / 111
    const deltaLng = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180))
    const minLat = latitude - deltaLat
    const maxLat = latitude + deltaLat
    const minLng = longitude - deltaLng
    const maxLng = longitude + deltaLng

    const shops = await prisma.$queryRaw<
      {
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
      }[]
    >`
      SELECT *
      FROM (
        SELECT
          id,
          name,
          slug,
          "shortDescription",
          city,
          country,
          latitude,
          longitude,
          "logoUrl",
          "isPhysicalStore",
          "isWebshop",
          "subscriptionTier",
          (
            6371 * acos(
              LEAST(1.0, GREATEST(-1.0,
                cos(radians(${latitude}))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians(${longitude}))
                + sin(radians(${latitude}))
                * sin(radians(latitude))
              ))
            )
          ) AS "distanceKm"
        FROM "Shop"
        WHERE status = 'APPROVED'
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND latitude BETWEEN ${minLat} AND ${maxLat}
          AND longitude BETWEEN ${minLng} AND ${maxLng}
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
