'use client'

import { useState, useEffect } from 'react'

export default function AdminLoginGegevensPage() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/admin/login-gegevens')
      .then(r => r.json())
      .then(d => { if (d.email) setCurrentEmail(d.email) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login-gegevens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, currentPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setCurrentEmail(newEmail)
        setNewEmail('')
        setCurrentPassword('')
        setSuccess(true)
      } else {
        setError(data.error || 'Er ging iets mis')
      }
    } catch {
      setError('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inloggegevens wijzigen</h1>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">
          E-mailadres succesvol gewijzigd!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Huidig e-mailadres</label>
          <input type="email" value={currentEmail} disabled className="input bg-gray-50 text-gray-500 cursor-not-allowed" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nieuw e-mailadres *</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            required
            className="input"
            placeholder="nieuw@emailadres.be"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Huidig wachtwoord *</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            className="input"
            placeholder="Ter bevestiging"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Opslaan...' : 'E-mailadres wijzigen'}
        </button>
      </form>
    </div>
  )
}
