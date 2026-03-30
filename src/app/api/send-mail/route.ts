import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order: Order = body.order;

    if (!order || !order.id) {
      return NextResponse.json({ error: 'Geçersiz sipariş verisi' }, { status: 400 });
    }

    await sendOrderConfirmationEmail(order);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[send-mail]', err);
    return NextResponse.json({ error: 'Mail gönderilemedi' }, { status: 500 });
  }
}
