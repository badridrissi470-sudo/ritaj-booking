import twilio from 'twilio';

// LIGNES DE DEBUG
console.log('=== DEBUG TWILIO ===');
console.log('ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'PRESENT' : 'MISSING');
console.log('MESSAGING_SERVICE_SID:', process.env.TWILIO_MESSAGING_SERVICE_SID);
console.log('====================');
// FIN DEBUG

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = twilio(accountSid, authToken);

export async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body: body,
      messagingServiceSid: messagingServiceSid,
      to: to,
    });

    console.log('SMS envoye avec succes:', message.sid);
    return {
      success: true,
      messageSid: message.sid,
      status: message.status,
    };
  } catch (error) {
    console.error('Erreur lors de envoi du SMS:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function sendReservationConfirmation(phoneNumber, reservationData) {
  const { date, time, terrain, clientName } = reservationData;

  const message = `Reservation confirmee - Ritaj Football Club

Nom: ${clientName}
Terrain: ${terrain}
Date: ${date}
Heure: ${time}

Merci de votre confiance ! A tres bientot sur nos terrains.

Contact: +33 7 45 59 76 46`;

  return await sendSMS(phoneNumber, message);
}

export default client;