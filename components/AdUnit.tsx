'use client'

import { useEffect, useState } from 'react'

interface AdPlacement {
  id: string
  slot: string
  type: string
  code: string | null
  isActive: boolean
}

export default function AdUnit({ slot, className = '' }: { slot: string; className?: string }) {
  const [ad, setAd] = useState<AdPlacement | null>(null)

  useEffect(() => {
    fetch(`/api/ads/${slot}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setAd(data))
      .catch(() => setAd(null))
  }, [slot])

  if (!ad || !ad.isActive || !ad.code) {
    return null
  }

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: ad.code }} />
    </div>
  )
}
