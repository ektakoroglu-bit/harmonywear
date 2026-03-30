import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { createOrder } from '@/lib/db/orderService';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: Omit<Order, 'id' | 'createdAt'> = await req.json();
    const userId = getSessionUserId() ?? undefined;

    const order = await createOrder(body, userId);
    if (!order) {
      return NextResponse.json({ error: 'createFailed' }, { status: 500 });
    }

    sendOrderConfirmationEmail(order).catch(err =>
      console.error('[orders] mail gönderilemedi:', err)
    );

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('[orders POST]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
