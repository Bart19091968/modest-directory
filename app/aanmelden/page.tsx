import { Metadata } from 'next'
import prisma from '@/lib/db'
import AanmeldenClient from '@/components/AanmeldenClient'

export const metadata: Metadata = {
  title: 'Winkel Aanmelden | ModestDirectory',
  description: 'Meld je islamitische kledingwinkel aan bij ModestDirectory. Kies uit BRONS, ZILVER of GOUD en bereik duizenden potentiële klanten in Nederland en België.',
  alternates: { canonical: '/aanmelden' },
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    })
  } catch {
    return []
  }
}

export default async function AanmeldenPage() {
  const categories = await getCategories()

  return <AanmeldenClient categories={categories} />
}
