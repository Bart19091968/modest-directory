import { Metadata } from 'next'
import AanmeldenClient from '@/components/AanmeldenClient'

export const metadata: Metadata = {
  title: 'Winkel Aanmelden | ModestDirectory',
  description: 'Meld je islamitische kledingwinkel aan bij ModestDirectory. Kies uit BRONS, ZILVER of GOUD en bereik duizenden potentiële klanten in Nederland en België.',
  alternates: { canonical: '/aanmelden' },
}

export default function AanmeldenPage() {
  return <AanmeldenClient />
}
