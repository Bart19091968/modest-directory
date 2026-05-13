'use client'

import { useState, useEffect } from 'react'

interface ShopRef { id: string; name: string; slug: string; status: string }
interface Owner { id: string; email: string; createdAt: string; shops: ShopRef[] }

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', shopId: '' })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchOwners() }, [])

  const fetchOwners = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/owners')
    if (res.ok) setOwners(await res.json())
    setLoading(false)
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Account ${email} verwijderen?`)) return
    await fetch(`/api/admin/owners?id=${id}`, { method: 'DELETE' })
    fetchOwners()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSaving(true)
    const res = await fetch('/api/admin/owners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setFormSuccess(data.updated ? 'Wachtwoord bijgewerkt.' : 'Account aangemaakt.')
      setForm({ email: '', password: '', shopId: '' })
      fetchOwners()
    } else {
      setFormError(data.error || 'Er ging iets mis')
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Winkelaccounts</h1>
        <button
          onClick={() => { setShowForm(v => !v); setFormError(''); setFormSuccess('') }}
          className="btn-primary"
        >
          {showForm ? 'Annuleren' : '+ Account aanmaken'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border p-6 mb-6 space-y-4 max-w-md">
          <h2 className="font-semibold text-gray-900">Account aanmaken / wachtwoord resetten</h2>
          {formError && <p className="text-red-600 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-600 text-sm">{formSuccess}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres *</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input" placeholder="eigenaar@winkel.be" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord * (min. 8 tekens)</label>
            <input type="password" required minLength={8} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="input" placeholder="Wachtwoord" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Winkel ID koppelen (optioneel)</label>
            <input type="text" value={form.shopId}
              onChange={e => setForm({ ...form, shopId: e.target.value })}
              className="input" placeholder="cuid van de winkel" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Laden...</p>
      ) : owners.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          Geen winkelaccounts gevonden.
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">E-mailadres</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Winkels</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aangemaakt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {owners.map(owner => (
                <tr key={owner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{owner.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {owner.shops.length === 0 ? (
                      <span className="text-gray-400 italic">geen</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {owner.shops.map(s => (
                          <li key={s.id}>
                            <span className="text-gray-700">{s.name}</span>
                            <span className="text-xs text-gray-400 ml-1">({s.status})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(owner.createdAt).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(owner.id, owner.email)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
