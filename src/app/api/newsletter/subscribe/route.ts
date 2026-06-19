import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabase, mockSubscribersDB } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 requests per 10 seconds
    if (!checkRateLimit(ip, 3, 10000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await req.json();
    const { email, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ message: 'Subscribed successfully.' }, { status: 200 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const payload = {
      email,
      subscribed_at: new Date().toISOString()
    };

    // If real Supabase is not configured, push to mock DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      // Enforce unique constraint
      if (mockSubscribersDB.find(s => s.email === email)) {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      mockSubscribersDB.push(payload);
    } else {
      const { error } = await supabase.from('subscribers').insert(payload);
      // Catch unique violation silently (Code 23505 in Postgres)
      if (error && error.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      } else if (error) {
        throw error;
      }
    }

    // Email Dispatch integration (Phase 6)
    if (process.env.BREVO_API_KEY) {
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'Akshat Gupta', email: 'gakshat415@gmail.com' },
            to: [{ email: email }],
            subject: 'Welcome to the Newsletter!',
            htmlContent: '<html><body><p>Thanks for subscribing to my newsletter.</p></body></html>'
          })
        });
      } catch (err) {
        console.error('Brevo email dispatch failed:', err);
      }
    } else if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to the Newsletter!',
            html: '<p>Thanks for subscribing to my newsletter.</p>'
          })
        });
      } catch (err) {
        console.error('Resend email dispatch failed:', err);
      }
    } else {
      console.log(`[Email Mock] Sent welcome email to ${email}`);
    }
    return NextResponse.json({ message: 'Created', data: payload }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
