'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/owner/logout', { method: 'POST' })
    router.push('/mijn-winkel/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm text-gray-500 hover:text-gray-700 border rounded-lg px-4 py-2 transition hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? 'Uitloggen...' : 'Uitloggen'}
    </button>
  )
}
