import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';
import { Order } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();

    if (!order?.id || !order?.customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Send both emails concurrently; don't block on failures
    const results = await Promise.allSettled([
      sendOrderConfirmationEmail(order),
      sendAdminOrderNotification(order),
    ]);

    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => r.reason?.message || 'Unknown error');

    if (errors.length > 0) {
      console.error('[EMAIL] Errors:', errors);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[EMAIL] Route error:', error);
    // Return 200 so checkout flow isn't blocked by email errors
    return NextResponse.json({ success: false, error: 'Email sending failed' });
  }
}
