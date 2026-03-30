import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db/orderService';
import { requireAdmin } from '@/lib/adminAuth';
import type { OrderStatus } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const err = requireAdmin();
  if (err) return err;

  try {
    const { status } = await req.json() as { status: OrderStatus };
    const ok = await updateOrderStatus(params.id, status);
    if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/orders PATCH]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
