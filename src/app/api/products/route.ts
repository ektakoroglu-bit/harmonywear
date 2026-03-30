import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db/productService';

// Public — no auth required. Used by storefront to populate adminStore.products.
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[api/products GET]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
