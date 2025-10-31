import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Génère tous les créneaux de 14:00 à 00:00
function generateTimeSlots() {
  const slots = []
  for (let hour = 14; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
  }
  slots.push('00:00')
  return slots
}

// Normalise le format d'heure (enlève les secondes si présentes)
function normalizeTime(time) {
  if (!time) return time
  // Si le format est "14:00:00", on garde juste "14:00"
  return time.substring(0, 5)
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const pitchId = searchParams.get('pitchId')

  if (!date || !pitchId) {
    return NextResponse.json({ error: 'Missing date or pitchId' }, { status: 400 })
  }

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('start_time')
    .eq('pitch_id', pitchId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed'])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Normalise les heures des réservations
  const bookedSlots = reservations.map(r => normalizeTime(r.start_time))

  const allSlots = generateTimeSlots().map(slot => ({
    time: slot,
    available: !bookedSlots.includes(slot)
  }))

  return NextResponse.json({ slots: allSlots })
}