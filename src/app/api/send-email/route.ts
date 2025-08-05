
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const { email, narrative } = await request.json();

    if (!email || !narrative) {
      return NextResponse.json({ success: false, error: 'Email and narrative data are required.' }, { status: 400 });
    }
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables.');
      return NextResponse.json({ success: false, error: 'Email service is not configured on the server.' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailHtml = `
      <h1>Proposal Narrative</h1>
      <h2>Context</h2>
      <p>${narrative.Context || 'N/A'}</p>
      <h2>Challenges</h2>
      <p>${narrative.Challenges || 'N/A'}</p>
      <h2>Opportunities</h2>
      <p>${narrative.Opportunities || 'N/A'}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@pratiktest.com',
      to: email,
      subject: 'Proposal Narrative',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error in send-email handler:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}
