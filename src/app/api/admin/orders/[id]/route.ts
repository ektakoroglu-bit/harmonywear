import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus, updateTrackingNumber, getOrderById } from '@/lib/db/orderService';
import { requireAdmin } from '@/lib/adminAuth';
import { sendShippingTrackingEmail } from '@/lib/email';
import type { OrderStatus } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const err = requireAdmin();
  if (err) return err;

  try {
    const body = await req.json() as { status?: OrderStatus; trackingNumber?: string; trackingUrl?: string };

    if (body.trackingNumber) {
      const ok = await updateTrackingNumber(params.id, body.trackingNumber);
      if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });

      const order = await getOrderById(params.id);
      if (order) {
        sendShippingTrackingEmail(
          order,
          body.trackingNumber,
          body.trackingUrl ?? ''
        ).catch(e => console.error('[admin/orders] tracking email failed:', e));
      }

      return NextResponse.json({ ok: true });
    }

    if (body.status) {
      const ok = await updateOrderStatus(params.id, body.status);
      if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'nothingToUpdate' }, { status: 400 });
  } catch (e) {
    console.error('[admin/orders PATCH]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
