import { NextResponse } from 'next/server';
import { sendSMS, sendReservationConfirmation } from '@/lib/twilio';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, to, message, reservationData } = body;

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Le numéro de téléphone est requis' },
        { status: 400 }
      );
    }

    if (!to.startsWith('+')) {
      return NextResponse.json(
        { success: false, error: 'Le numéro doit être au format international (+33...)' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'confirmation':
        if (!reservationData) {
          return NextResponse.json(
            { success: false, error: 'Les données de réservation sont requises' },
            { status: 400 }
          );
        }
        result = await sendReservationConfirmation(to, reservationData);
        break;

      case 'custom':
        if (!message) {
          return NextResponse.json(
            { success: false, error: 'Le message est requis pour un SMS personnalisé' },
            { status: 400 }
          );
        }
        result = await sendSMS(to, message);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Type de SMS invalide' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'SMS envoyé avec succès',
        data: result,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur dans API send-sms:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API SMS Twilio - Ritaj Booking',
    status: 'active'
  });
}
