
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { NarrativeData } from '@/lib/types';

// Ensure the API key is being loaded from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

function generateHtml(data: NarrativeData): string {
    return `
        <h1>Budget Proposal Narrative</h1>
        <h2>Context</h2>
        <p>${data.Context.replace(/\n/g, '<br>')}</p>
        <h2>Challenges</h2>
        <p>${data.Challenges.replace(/\n/g, '<br>')}</p>
        <h2>Opportunities</h2>
        <p>${data.Opportunities.replace(/\n/g, '<br>')}</p>
    `;
}

export async function POST(request: Request) {
    // Check for API key at runtime
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set in environment variables.');
        return NextResponse.json({ success: false, error: 'Email service is not configured on the server.' }, { status: 500 });
    }
  
    try {
        const body = await request.json();
        const { to, subject, content } = body;

        if (!to || !subject || !content) {
            return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
        }

        const htmlContent = generateHtml(content);
        
        const { data, error } = await resend.emails.send({
            from: 'Quantum Plus <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error('Error from Resend:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Error in POST handler:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
