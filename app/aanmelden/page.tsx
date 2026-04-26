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
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    })
    
    if (dbCategories.length > 0) {
      return dbCategories
    }
  } catch (e) {
    console.error('Error fetching categories from database:', e)
  }

  // Fallback: hardcoded categories
  return [
    { id: 'hijab-shops', name: 'Hijab Shops' },
    { id: 'abaya-shops', name: 'Abaya Winkels' },
    { id: 'islamitische-kleding', name: 'Islamitische Kleding' },
  ]
}

export default async function AanmeldenPage() {
  const categories = await getCategories()

  return <AanmeldenClient categories={categories} />
}
