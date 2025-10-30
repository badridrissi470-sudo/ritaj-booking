'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ReserverPage() {
  const [pitches, setPitches] = useState([])
  const [selectedPitch, setSelectedPitch] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    playersCount: ''
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Récupère les terrains au chargement
  useEffect(() => {
    // Pour l'instant on met les terrains en dur (ou tu peux créer une API)
    setPitches([
      { id: '54d5ba10-9122-4bae-a6cf-c2044dc413e7', name: 'Terrain Gauche' },
      { id: '9cab2012-f6da-433e-9df3-0b6b964e8813', name: 'Terrain Droit' }
    ])
    
    // Date par défaut = aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
  }, [])

  // Récupère les créneaux disponibles quand terrain/date changent
  useEffect(() => {
    if (selectedPitch && selectedDate) {
      fetchAvailability()
    }
  }, [selectedPitch, selectedDate])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/availability?pitchId=${selectedPitch}&date=${selectedDate}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleSlotClick = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot.time)
      setShowForm(true)
      setSuccess(false)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pitchId: selectedPitch,
          date: selectedDate,
          startTime: selectedSlot,
          customerName: formData.customerName,
          phone: formData.phone,
          playersCount: formData.playersCount ? parseInt(formData.playersCount) : null
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setShowForm(false)
        setFormData({ customerName: '', phone: '', playersCount: '' })
        fetchAvailability() // Rafraîchit les créneaux
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Réserver un terrain</h1>
          <Link href="/" className="text-white hover:underline">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Sélecteurs */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Sélection terrain */}
            <div>
              <label className="block text-sm font-bold mb-2">Terrain</label>
              <select
                value={selectedPitch}
                onChange={(e) => setSelectedPitch(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Choisir un terrain</option>
                {pitches.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Sélection date */}
            <div>
              <label className="block text-sm font-bold mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Grille des créneaux */}
        {selectedPitch && selectedDate && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Créneaux disponibles</h2>
            {loading ? (
              <p className="text-center py-8 text-gray-500">Chargement...</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {slots.map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!slot.available}
                    className={`py-3 px-4 rounded font-bold transition ${
                      slot.available
                        ? 'bg-green-100 hover:bg-green-200 text-green-800 cursor-pointer'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } ${selectedSlot === slot.time ? 'ring-2 ring-green-600' : ''}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Vos informations</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Nombre de joueurs (optionnel)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.playersCount}
                  onChange={(e) => setFormData({...formData, playersCount: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: 10"
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition disabled:opacity-50"
              >
                {loading ? 'Confirmation...' : 'Confirmer la réservation'}
              </button>
            </form>
          </div>
        )}

        {/* Message de succès */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">✅ Réservation enregistrée !</h3>
            <p className="mb-2">Présentez-vous <strong>10 minutes avant l'heure</strong>.</p>
            <p className="mb-2"><strong>Paiement à la caisse.</strong></p>
            <p className="text-sm">Pour toute question : <strong>+33 7 45 59 76 46</strong></p>
          </div>
        )}
      </main>
    </div>
  )
}