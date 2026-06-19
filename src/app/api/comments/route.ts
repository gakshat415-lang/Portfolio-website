import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabase, mockCommentsDB } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 requests per 10 seconds (as requested in Eval)
    if (!checkRateLimit(ip, 3, 10000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = await req.json();
    const { entity_id, guest_name, comment_text, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      // Deceive the bot by returning 200 OK without writing data
      return NextResponse.json({ message: 'Comment submitted successfully.' }, { status: 200 });
    }

    if (!entity_id || !guest_name || !comment_text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      id: crypto.randomUUID(),
      entity_id,
      guest_name,
      comment_text,
      timestamp: new Date().toISOString()
    };

    // If real Supabase is not configured, push to mock DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
      mockCommentsDB.push(payload);
    } else {
      const { error } = await supabase.from('comments').insert(payload);
      if (error) throw error;
    }

    return NextResponse.json({ message: 'Created', data: payload }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
