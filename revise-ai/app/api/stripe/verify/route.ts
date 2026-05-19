import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id manquant' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid' || session.status === 'complete') {
      const email = session.customer_email || session.metadata?.email || '';
      const expires = Date.now() + 365 * 24 * 60 * 60 * 1000;
      const payload = Buffer.from(JSON.stringify({ email, expires })).toString('base64');
      const token = `pro.${payload}.ok`;

      return NextResponse.json({ success: true, email, token });
    }

    return NextResponse.json({ success: false }, { status: 402 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
