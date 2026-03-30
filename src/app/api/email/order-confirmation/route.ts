import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { Order } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();

    if (!order?.id || !order?.customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    await sendOrderConfirmationEmail(order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[EMAIL] Route error:', error);
    // Return 200 so checkout flow isn't blocked by email errors
    return NextResponse.json({ success: false, error: 'Email sending failed' });
  }
}
