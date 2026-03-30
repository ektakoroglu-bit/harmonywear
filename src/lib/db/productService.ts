import { supabaseAdmin as supabase } from '@/lib/supabaseServer';
import type {
  Product,
  ProductCategory,
  ProductColor,
  StockItem,
  Banner,
  DiscountCode,
  Review,
  StockNotification,
} from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DbProduct = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: ProductCategory;
  sizes: string[];
  material_tr: string | null;
  material_en: string | null;
  care_tr: string | null;
  care_en: string | null;
  is_new: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  tags: string[];
  sku: string;
  created_at: string;
  product_colors?: DbProductColor[];
  product_stock?: DbProductStock[];
};

type DbProductColor = {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  label_tr: string;
  label_en: string;
};

type DbProductStock = {
  id: string;
  product_id: string;
  size: string;
  color_name: string;
  quantity: number;
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toProduct(row: DbProduct): Product {
  const colors: ProductColor[] = (row.product_colors ?? []).map((c) => ({
    name: c.name,
    hex: c.hex,
    label: { tr: c.label_tr, en: c.label_en },
  }));

  const stock: StockItem[] = (row.product_stock ?? []).map((s) => ({
    size: s.size as import('@/types').ProductSize,
    color: s.color_name,
    quantity: s.quantity,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: { tr: row.name_tr, en: row.name_en },
    description: { tr: row.description_tr, en: row.description_en },
    price: row.price,
    salePrice: row.sale_price ?? undefined,
    images: row.images,
    category: row.category,
    sizes: row.sizes as import('@/types').ProductSize[],
    colors,
    stock,
    material: { tr: row.material_tr ?? '', en: row.material_en ?? '' },
    care: { tr: row.care_tr ?? '', en: row.care_en ?? '' },
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    tags: row.tags,
    sku: row.sku,
    createdAt: row.created_at,
  };
}

const PRODUCT_QUERY = `
  *,
  product_colors(*),
  product_stock(*)
`;

// ─── Product queries ──────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_QUERY)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_QUERY)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return toProduct(data as DbProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_QUERY)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return toProduct(data as DbProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_QUERY)
    .eq('is_featured', true);

  if (error || !data) return [];
  return (data as DbProduct[]).map(toProduct);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_QUERY)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbProduct[]).map(toProduct);
}

// ─── Product mutations ────────────────────────────────────────────────────────

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt'>
): Promise<Product | null> {
  const { data: productRow, error } = await supabase
    .from('products')
    .insert({
      slug: product.slug,
      name_tr: product.name.tr,
      name_en: product.name.en,
      description_tr: product.description.tr,
      description_en: product.description.en,
      price: product.price,
      sale_price: product.salePrice ?? null,
      images: product.images,
      category: product.category,
      sizes: product.sizes,
      material_tr: product.material.tr,
      material_en: product.material.en,
      care_tr: product.care.tr,
      care_en: product.care.en,
      is_new: product.isNew ?? false,
      is_featured: product.isFeatured ?? false,
      is_bestseller: product.isBestseller ?? false,
      tags: product.tags,
      sku: product.sku,
    })
    .select()
    .single();

  if (error || !productRow) return null;

  const productId = productRow.id;
  await upsertProductColors(productId, product.colors);
  await upsertProductStock(productId, product.stock);

  return getProductById(productId);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<boolean> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.slug !== undefined)          dbUpdates.slug           = updates.slug;
  if (updates.name !== undefined)          { dbUpdates.name_tr = updates.name.tr; dbUpdates.name_en = updates.name.en; }
  if (updates.description !== undefined)   { dbUpdates.description_tr = updates.description.tr; dbUpdates.description_en = updates.description.en; }
  if (updates.price !== undefined)         dbUpdates.price          = updates.price;
  if (updates.salePrice !== undefined)     dbUpdates.sale_price     = updates.salePrice ?? null;
  if (updates.images !== undefined)        dbUpdates.images         = updates.images;
  if (updates.category !== undefined)      dbUpdates.category       = updates.category;
  if (updates.sizes !== undefined)         dbUpdates.sizes          = updates.sizes;
  if (updates.material !== undefined)      { dbUpdates.material_tr = updates.material.tr; dbUpdates.material_en = updates.material.en; }
  if (updates.care !== undefined)          { dbUpdates.care_tr = updates.care.tr; dbUpdates.care_en = updates.care.en; }
  if (updates.isNew !== undefined)         dbUpdates.is_new         = updates.isNew;
  if (updates.isFeatured !== undefined)    dbUpdates.is_featured    = updates.isFeatured;
  if (updates.isBestseller !== undefined)  dbUpdates.is_bestseller  = updates.isBestseller;
  if (updates.tags !== undefined)          dbUpdates.tags           = updates.tags;
  if (updates.sku !== undefined)           dbUpdates.sku            = updates.sku;

  if (Object.keys(dbUpdates).length > 0) {
    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) return false;
  }

  if (updates.colors !== undefined) await upsertProductColors(id, updates.colors);
  if (updates.stock !== undefined)  await upsertProductStock(id, updates.stock);

  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return !error;
}

export async function updateStock(
  productId: string,
  stockItems: StockItem[]
): Promise<boolean> {
  return upsertProductStock(productId, stockItems);
}

// ─── Banners ──────────────────────────────────────────────────────────────────

export async function getActiveBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: { tr: row.title_tr, en: row.title_en },
    subtitle: { tr: row.subtitle_tr, en: row.subtitle_en },
    image: row.image,
    imageMobile: row.image_mobile ?? undefined,
    link: row.link ?? undefined,
    buttonText: row.button_text_tr
      ? { tr: row.button_text_tr, en: row.button_text_en ?? '' }
      : undefined,
    order: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function getAllBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order');

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: { tr: row.title_tr, en: row.title_en },
    subtitle: { tr: row.subtitle_tr, en: row.subtitle_en },
    image: row.image,
    imageMobile: row.image_mobile ?? undefined,
    link: row.link ?? undefined,
    buttonText: row.button_text_tr
      ? { tr: row.button_text_tr, en: row.button_text_en ?? '' }
      : undefined,
    order: row.sort_order,
    isActive: row.is_active,
  }));
}

export async function upsertBanner(banner: Omit<Banner, 'id'> & { id?: string }): Promise<boolean> {
  const row = {
    title_tr: banner.title.tr,
    title_en: banner.title.en,
    subtitle_tr: banner.subtitle.tr,
    subtitle_en: banner.subtitle.en,
    image: banner.image,
    image_mobile: banner.imageMobile ?? null,
    link: banner.link ?? null,
    button_text_tr: banner.buttonText?.tr ?? null,
    button_text_en: banner.buttonText?.en ?? null,
    sort_order: banner.order,
    is_active: banner.isActive,
  };

  const query = banner.id
    ? supabase.from('banners').update(row).eq('id', banner.id)
    : supabase.from('banners').insert(row);

  const { error } = await query;
  return !error;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  return !error;
}

export async function reorderBanners(orderedIds: string[]): Promise<boolean> {
  const updates = orderedIds.map((id, index) =>
    supabase.from('banners').update({ sort_order: index }).eq('id', id)
  );
  const results = await Promise.all(updates);
  return results.every(({ error }) => !error);
}

// ─── Discounts ────────────────────────────────────────────────────────────────

export async function getAllDiscounts(): Promise<DiscountCode[]> {
  const { data, error } = await supabase.from('discounts').select('*');
  if (error || !data) return [];
  return data.map(toDiscount);
}

export async function getDiscountByCode(code: string): Promise<DiscountCode | null> {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return toDiscount(data);
}

export async function incrementDiscountUsage(id: string): Promise<boolean> {
  const { error } = await supabase.rpc('increment_discount_usage', { discount_id: id });
  return !error;
}

export async function upsertDiscount(
  discount: Omit<DiscountCode, 'id' | 'usedCount'> & { id?: string }
): Promise<boolean> {
  const row = {
    code: discount.code.toUpperCase(),
    type: discount.type,
    value: discount.value,
    min_order: discount.minOrder ?? null,
    max_uses: discount.maxUses ?? null,
    expiry_date: discount.expiryDate ?? null,
    is_active: discount.isActive,
  };

  const query = discount.id
    ? supabase.from('discounts').update(row).eq('id', discount.id)
    : supabase.from('discounts').insert(row);

  const { error } = await query;
  return !error;
}

export async function deleteDiscount(id: string): Promise<boolean> {
  const { error } = await supabase.from('discounts').delete().eq('id', id);
  return !error;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getApprovedReviewsByProduct(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(toReview);
}

export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(toReview);
}

export async function createReview(
  review: Omit<Review, 'id' | 'status' | 'createdAt'>
): Promise<boolean> {
  const { error } = await supabase.from('reviews').insert({
    product_id: review.productId,
    user_id: review.userId,
    user_name: review.userName,
    order_id: review.orderId,
    rating: review.rating,
    comment: review.comment,
  });
  return !error;
}

export async function updateReviewStatus(
  id: string,
  status: Review['status']
): Promise<boolean> {
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
  return !error;
}

// ─── Stock notifications ──────────────────────────────────────────────────────

export async function getAllStockNotifications(): Promise<StockNotification[]> {
  const { data, error } = await supabase
    .from('stock_notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(toStockNotification);
}

export async function addStockNotification(
  n: Omit<StockNotification, 'id' | 'createdAt'>
): Promise<boolean> {
  const { error } = await supabase.from('stock_notifications').insert({
    product_id: n.productId,
    product_name: n.productName,
    size: n.size,
    color_name: n.colorName,
    color_hex: n.colorHex,
    email: n.email,
  });
  return !error;
}

export async function deleteStockNotification(id: string): Promise<boolean> {
  const { error } = await supabase.from('stock_notifications').delete().eq('id', id);
  return !error;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function upsertProductColors(
  productId: string,
  colors: ProductColor[]
): Promise<boolean> {
  await supabase.from('product_colors').delete().eq('product_id', productId);
  if (colors.length === 0) return true;

  const { error } = await supabase.from('product_colors').insert(
    colors.map((c) => ({
      product_id: productId,
      name: c.name,
      hex: c.hex,
      label_tr: c.label.tr,
      label_en: c.label.en,
    }))
  );
  return !error;
}

async function upsertProductStock(
  productId: string,
  stockItems: StockItem[]
): Promise<boolean> {
  await supabase.from('product_stock').delete().eq('product_id', productId);
  if (stockItems.length === 0) return true;

  const { error } = await supabase.from('product_stock').insert(
    stockItems.map((s) => ({
      product_id: productId,
      size: s.size,
      color_name: s.color,
      quantity: s.quantity,
    }))
  );
  return !error;
}

function toDiscount(row: Record<string, unknown>): DiscountCode {
  return {
    id: row.id as string,
    code: row.code as string,
    type: row.type as DiscountCode['type'],
    value: row.value as number,
    minOrder: (row.min_order as number | null) ?? undefined,
    maxUses: (row.max_uses as number | null) ?? undefined,
    usedCount: row.used_count as number,
    expiryDate: (row.expiry_date as string | null) ?? undefined,
    isActive: row.is_active as boolean,
  };
}

function toReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    orderId: row.order_id as string,
    rating: row.rating as number,
    comment: row.comment as string,
    status: row.status as Review['status'],
    createdAt: row.created_at as string,
  };
}

function toStockNotification(row: Record<string, unknown>): StockNotification {
  return {
    id: row.id as string,
    productId: row.product_id as string,
    productName: row.product_name as string,
    size: row.size as string,
    colorName: row.color_name as string,
    colorHex: row.color_hex as string,
    email: row.email as string,
    createdAt: row.created_at as string,
  };
}
