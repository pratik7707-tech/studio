
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { email, narrative } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, error: 'Email service is not configured on the server.' }, { status: 500 });
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: 'onboarding@pratiktest.com',
        to: email,
        subject: 'Your Budget Narrative',
        html: `<p>Context: ${narrative.Context}</p><p>Challenges: ${narrative.Challenges}</p><p>Opportunities: ${narrative.Opportunities}</p>`,
    });

    if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });

  } catch (error) {
    console.error('Error in send-email handler:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
