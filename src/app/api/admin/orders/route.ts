import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/db/orderService';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const err = requireAdmin();
  if (err) return err;

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (e) {
    console.error('[admin/orders GET]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
