
import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { phoneNumber, narrative } = await request.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        return NextResponse.json({ success: false, error: 'Twilio service is not configured on the server. Please check environment variables.' }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);

    const messageBody = `Budget Narrative:
Context: ${narrative.Context}
Challenges: ${narrative.Challenges}
Opportunities: ${narrative.Opportunities}`;

    await client.messages.create({
        body: messageBody,
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${phoneNumber}`
    });

    return NextResponse.json({ success: true, message: 'WhatsApp message sent successfully.' });

  } catch (error: any) {
    console.error('Error in send-whatsapp handler:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error.message) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
