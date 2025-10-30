import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PATCH(request, context) {
  // Next.js 15 : params doit être awaité
  const params = await context.params
  const { id } = params
  
  const body = await request.json()
  const { status } = body

  console.log('Received ID:', id)
  console.log('Received status:', status)

  if (!status || !['pending', 'confirmed', 'done', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, reservation: data[0] })
}