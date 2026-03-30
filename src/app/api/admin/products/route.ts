import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db/productService';
import { requireAdmin } from '@/lib/adminAuth';
import type { Product } from '@/types';

export async function GET() {
  const err = requireAdmin();
  if (err) return err;

  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (e) {
    console.error('[admin/products GET]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = requireAdmin();
  if (err) return err;

  try {
    const productData: Omit<Product, 'id' | 'createdAt'> = await req.json();
    const product = await createProduct(productData);
    if (!product) return NextResponse.json({ error: 'createFailed' }, { status: 500 });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    console.error('[admin/products POST]', e);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
