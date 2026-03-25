import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slot: string } }
) {
  try {
    const ad = await prisma.adPlacement.findUnique({
      where: { slot: params.slot },
    })

    if (!ad) {
      return NextResponse.json(null)
    }

    return NextResponse.json(ad)
  } catch (error) {
    return NextResponse.json(null)
  }
}
