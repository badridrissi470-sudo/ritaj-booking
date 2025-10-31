'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [reservations, setReservations] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPitch, setSelectedPitch] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const pitches = [
    { id: '54d5ba10-9122-4bae-a6cf-c2044dc413e7', name: 'Terrain Gauche' },
    { id: '9cab2012-f6da-433e-9df3-0b6b964e8813', name: 'Terrain Droit' }
  ]

  useEffect(() => {
    // Date par défaut = aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [])

  useEffect(() => {
    if (isAuthenticated && selectedDate) {
      fetchReservations()
    }
  }, [isAuthenticated, selectedDate, selectedPitch])

  const handleLogin = (e) => {
    e.preventDefault()
    // Mot de passe simple pour la V1 (à améliorer plus tard)
    if (password === 'ritaj2025') {
      setIsAuthenticated(true)
    } else {
      alert('Mot de passe incorrect')
    }
  }

  const fetchReservations = async () => {
    setLoading(true)
    try {
      let url = `/api/reservations?date=${selectedDate}`
      if (selectedPitch) url += `&pitchId=${selectedPitch}`
      
      const res = await fetch(url)
      const data = await res.json()
      setReservations(data.reservations || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        fetchReservations() // Rafraîchit la liste
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      done: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      done: 'Terminée',
      cancelled: 'Annulée'
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Admin - Ritaj</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Entrez le mot de passe"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin - Réservations</h1>
          <Link href="/" className="text-white hover:underline">
            ← Accueil
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-black">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-black">Terrain</label>
              <select
                value={selectedPitch}
                onChange={(e) => setSelectedPitch(e.target.value)}
                className="w-full border rounded px-3 py-2 text-black"
              >
                <option value="">Tous les terrains</option>
                {pitches.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-black">
            {reservations.length} réservation(s)
          </div>
          
          {loading ? (
            <p className="text-center py-8 text-black">Chargement...</p>
          ) : reservations.length === 0 ? (
            <p className="text-center py-8 text-black">Aucune réservation pour cette date</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Heure</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Terrain</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Téléphone</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Joueurs</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-black">{res.start_time}</td>
                      <td className="px-4 py-3 text-black">{res.pitches?.name}</td>
                      <td className="px-4 py-3 text-black">{res.customer_name}</td>
                      <td className="px-4 py-3 text-black">{res.phone}</td>
                      <td className="px-4 py-3 text-black">{res.players_count || '-'}</td>
                      <td className="px-4 py-3">{getStatusBadge(res.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {res.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(res.id, 'confirmed')}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                            >
                              Confirmer
                            </button>
                          )}
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => updateStatus(res.id, 'done')}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                            >
                              Terminer
                            </button>
                          )}
                          {(res.status === 'pending' || res.status === 'confirmed') && (
                            <button
                              onClick={() => updateStatus(res.id, 'cancelled')}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}