import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Calcule end_time = start_time + 1h
function calculateEndTime(startTime) {
  const [hours, minutes] = startTime.split(':')
  let endHour = parseInt(hours) + 1
  
  if (endHour === 1 && hours === '00') {
    return '01:00'
  }
  
  if (endHour === 24) endHour = 0
  return `${endHour.toString().padStart(2, '0')}:${minutes}`
}

export async function POST(request) {
  const body = await request.json()
  const { pitchId, date, startTime, customerName, phone, playersCount } = body

  if (!pitchId || !date || !startTime || !customerName || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Vérifie si le créneau est libre
  const { data: existing } = await supabase
    .from('reservations')
    .select('id')
    .eq('pitch_id', pitchId)
    .eq('date', date)
    .eq('start_time', startTime)
    .in('status', ['pending', 'confirmed'])
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Ce créneau est déjà réservé' }, { status: 409 })
  }

  // Crée la réservation
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      pitch_id: pitchId,
      date,
      start_time: startTime,
      end_time: calculateEndTime(startTime),
      customer_name: customerName,
      phone,
      players_count: playersCount || null,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, reservation: data })
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const pitchId = searchParams.get('pitchId')

  let query = supabase
    .from('reservations')
    .select('*, pitches(name)')
    .order('start_time', { ascending: true })

  if (date) query = query.eq('date', date)
  if (pitchId) query = query.eq('pitch_id', pitchId)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reservations: data })
}