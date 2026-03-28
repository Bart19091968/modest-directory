'use client'

import { useEffect, useState, useRef } from 'react'

interface AdPlacement {
  id: string
  slot: string
  type: string
  code: string | null
  isActive: boolean
}

export default function AdUnit({ slot, className = '' }: { slot: string; className?: string }) {
  const [ad, setAd] = useState<AdPlacement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/ads/${slot}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setAd(data))
      .catch(() => setAd(null))
  }, [slot])

  useEffect(() => {
    if (!ad || !ad.isActive || !ad.code || !containerRef.current) return

    const container = containerRef.current
    container.innerHTML = ''

    // Parse the HTML and handle scripts separately
    const temp = document.createElement('div')
    temp.innerHTML = ad.code

    // Insert non-script elements first
    Array.from(temp.childNodes).forEach(node => {
      if (node.nodeName !== 'SCRIPT') {
        container.appendChild(node.cloneNode(true))
      }
    })

    // Then create and execute script tags properly
    temp.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script')
      
      // Copy all attributes
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value)
      })

      // Copy inline content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }

      container.appendChild(newScript)
    })

    // Trigger AdSense push if available
    try {
      if ((window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({})
      }
    } catch (e) {
      // AdSense not loaded yet, that's ok
    }
  }, [ad])

  if (!ad || !ad.isActive || !ad.code) {
    return null
  }

  return (
    <div className={className} ref={containerRef} />
  )
}
