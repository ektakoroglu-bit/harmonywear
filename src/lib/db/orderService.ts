import { supabaseAdmin as supabase } from '@/lib/supabaseServer';
import type { Order, OrderStatus, CartItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type CreateOrderPayload = Omit<Order, 'id' | 'createdAt'>;

type DbOrder = {
  id: string;
  display_id: string;
  user_id: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string | null;
  shipping_zip: string | null;
  shipping_country: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_district: string | null;
  billing_zip: string | null;
  billing_country: string;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  discount_code: string | null;
  status: OrderStatus;
  payment_id: string | null;
  created_at: string;
};

type DbOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_tr: string;
  product_name_en: string;
  product_sku: string;
  product_image: string | null;
  size: string;
  color_name: string;
  color_hex: string;
  unit_price: number;
  quantity: number;
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

function generateDisplayId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `HW-${year}-${suffix}`;
}

function toOrder(row: DbOrder, items: CartItem[] = []): Order {
  return {
    id: row.display_id,
    items,
    customer: {
      firstName: row.customer_first_name,
      lastName: row.customer_last_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },
    shippingAddress: {
      firstName: row.shipping_first_name,
      lastName: row.shipping_last_name,
      address: row.shipping_address,
      city: row.shipping_city,
      district: row.shipping_district ?? '',
      zipCode: row.shipping_zip ?? '',
      country: row.shipping_country,
    },
    billingAddress: {
      firstName: row.billing_first_name,
      lastName: row.billing_last_name,
      address: row.billing_address,
      city: row.billing_city,
      district: row.billing_district ?? '',
      zipCode: row.billing_zip ?? '',
      country: row.billing_country,
    },
    subtotal: row.subtotal,
    shipping: row.shipping_cost,
    discount: row.discount,
    total: row.total,
    discountCode: row.discount_code ?? undefined,
    status: row.status,
    paymentId: row.payment_id ?? undefined,
    createdAt: row.created_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getOrderById(id: string): Promise<Order | null> {
  const { data: orderRow, error } = await supabase
    .from('orders')
    .select('*')
    .eq('display_id', id)
    .single();

  if (error || !orderRow) return null;

  const items = await getOrderItems(id);
  return toOrder(orderRow as DbOrder, items);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return Promise.all(
    (data as DbOrder[]).map(async (row) => {
      const items = await getOrderItems(row.id);
      return toOrder(row, items);
    })
  );
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return Promise.all(
    (data as DbOrder[]).map(async (row) => {
      const items = await getOrderItems(row.id);
      return toOrder(row, items);
    })
  );
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createOrder(
  payload: CreateOrderPayload,
  userId?: string
): Promise<Order | null> {
  const { customer, shippingAddress, billingAddress, items } = payload;

  const displayId = generateDisplayId();

  const { data: orderRow, error } = await supabase
    .from('orders')
    .insert({
      display_id: displayId,
      user_id: userId ?? null,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_first_name: shippingAddress.firstName,
      shipping_last_name: shippingAddress.lastName,
      shipping_address: shippingAddress.address,
      shipping_city: shippingAddress.city,
      shipping_district: shippingAddress.district || null,
      shipping_zip: shippingAddress.zipCode || null,
      shipping_country: shippingAddress.country,
      billing_first_name: billingAddress.firstName,
      billing_last_name: billingAddress.lastName,
      billing_address: billingAddress.address,
      billing_city: billingAddress.city,
      billing_district: billingAddress.district || null,
      billing_zip: billingAddress.zipCode || null,
      billing_country: billingAddress.country,
      subtotal: payload.subtotal,
      shipping_cost: payload.shipping,
      discount: payload.discount,
      total: payload.total,
      discount_code: payload.discountCode ?? null,
      status: payload.status,
      payment_id: payload.paymentId ?? null,
    })
    .select()
    .single();

  if (error || !orderRow) return null;

  // Insert order items
  if (items.length > 0) {
    const itemRows = items.map((item: CartItem) => ({
      order_id: orderRow.id,
      product_id: item.product.id,
      product_name_tr: item.product.name.tr,
      product_name_en: item.product.name.en,
      product_sku: item.product.sku,
      product_image: item.product.images[0] ?? null,
      size: item.size,
      color_name: item.color.name,
      color_hex: item.color.hex,
      unit_price: item.product.salePrice ?? item.product.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
    if (itemsError) return null;
  }

  return toOrder(orderRow as DbOrder, items);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  return !error;
}

export async function setOrderPaymentId(id: string, paymentId: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ payment_id: paymentId, status: 'paid' })
    .eq('id', id);

  return !error;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrderItems(orderId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error || !data) return [];

  return (data as DbOrderItem[]).map((row) => ({
    product: {
      id: row.product_id ?? '',
      slug: '',
      name: { tr: row.product_name_tr, en: row.product_name_en },
      description: { tr: '', en: '' },
      price: row.unit_price,
      images: row.product_image ? [row.product_image] : [],
      category: 'bodysuits' as const,
      sizes: [],
      colors: [],
      stock: [],
      material: { tr: '', en: '' },
      care: { tr: '', en: '' },
      tags: [],
      sku: row.product_sku,
      createdAt: '',
    },
    size: row.size as import('@/types').ProductSize,
    color: { name: row.color_name, hex: row.color_hex, label: { tr: row.color_name, en: row.color_name } },
    quantity: row.quantity,
  }));
}
