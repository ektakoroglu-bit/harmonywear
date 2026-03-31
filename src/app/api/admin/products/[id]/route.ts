import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct, updateStock, getStockNotificationsByProductId, deleteStockNotification } from '@/lib/db/productService';
import { requireAdmin } from '@/lib/adminAuth';
import { sendStockNotificationEmail } from '@/lib/email';
import type { Product, StockItem } from '@/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const err = requireAdmin();
  if (err) return err;

  try {
    const body = await req.json() as Partial<Product> & { stockOnly?: boolean; stock?: StockItem[] };

    if (body.stockOnly && body.stock) {
      const ok = await updateStock(params.id, body.stock);
      if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });

      // Notify subscribers whose size/color is now back in stock
      const newlyInStock = new Set(
        body.stock
          .filter(s => s.quantity > 0)
          .map(s => `${s.size}::${s.color}`)
      );

      const notifications = await getStockNotificationsByProductId(params.id);
      for (const n of notifications) {
        if (newlyInStock.has(`${n.size}::${n.colorName}`)) {
          sendStockNotificationEmail(n.email, n.productName).catch(e =>
            console.error('[admin/products] stock notification email failed:', e)
          );
          await deleteStockNotification(n.id);
        }
      }

      return NextResponse.json({ ok: true });
    }

    const ok = await updateProduct(params.id, body);
    if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/products PATCH]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const err = requireAdmin();
  if (err) return err;

  try {
    const ok = await deleteProduct(params.id);
    if (!ok) return NextResponse.json({ error: 'deleteFailed' }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/products DELETE]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
