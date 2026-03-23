import { Product, DiscountCode, Banner } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'seamless-bodysuit-classic',
    name: { tr: 'Klasik Dikişsiz Bodysuit', en: 'Classic Seamless Bodysuit' },
    description: {
      tr: 'Günlük kullanım için ideal dikişsiz bodysuit. Nefes alabilen mikrofiber kumaşı ile sizi gün boyu konforlu hissettirir. Vücudunuza mükemmel uyum sağlayan fit tasarımı ile güveninizi artırır.',
      en: 'Ideal seamless bodysuit for everyday wear. Breathable microfiber fabric keeps you comfortable all day. The perfect-fit design boosts your confidence.',
    },
    price: 549,
    salePrice: 389,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    ],
    category: 'bodysuits',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
      { name: 'white', hex: '#F5F5F5', label: { tr: 'Beyaz', en: 'White' } },
    ],
    stock: [
      { size: 'XS', color: 'nude', quantity: 15 },
      { size: 'S', color: 'nude', quantity: 20 },
      { size: 'M', color: 'nude', quantity: 18 },
      { size: 'L', color: 'nude', quantity: 12 },
      { size: 'XL', color: 'nude', quantity: 8 },
      { size: 'S', color: 'black', quantity: 25 },
      { size: 'M', color: 'black', quantity: 22 },
      { size: 'L', color: 'black', quantity: 15 },
      { size: 'XL', color: 'black', quantity: 10 },
      { size: 'S', color: 'white', quantity: 10 },
      { size: 'M', color: 'white', quantity: 8 },
      { size: 'L', color: 'white', quantity: 5 },
    ],
    material: { tr: '85% Polyamid, 15% Elastan', en: '85% Polyamide, 15% Elastane' },
    care: { tr: '30°C makinede yıkayın, düşük ısıda kurutun', en: 'Machine wash at 30°C, tumble dry low' },
    isNew: false,
    isFeatured: true,
    isBestseller: true,
    tags: ['bodysuit', 'seamless', 'everyday'],
    sku: 'BST-001',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'sculpting-waist-shaper',
    name: { tr: 'Bel İncelten Vücut Şekillendirici', en: 'Sculpting Waist Shaper' },
    description: {
      tr: 'Özel dokuma teknolojisiyle hazırlanan bel şekillendirici, anında ince bir görünüm sağlar. Yüksek bel tasarımı ve güçlü kontrol paneli ile perfect silüet.',
      en: 'Specially woven waist shaper provides an instantly slimmer look. High-waist design with strong control panel for a perfect silhouette.',
    },
    price: 749,
    images: [
      'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',
      'https://images.unsplash.com/photo-1583846717393-dc2412c95ed7?w=800',
    ],
    category: 'shapewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
    ],
    stock: [
      { size: 'S', color: 'nude', quantity: 12 },
      { size: 'M', color: 'nude', quantity: 18 },
      { size: 'L', color: 'nude', quantity: 14 },
      { size: 'XL', color: 'nude', quantity: 6 },
      { size: 'S', color: 'black', quantity: 20 },
      { size: 'M', color: 'black', quantity: 16 },
      { size: 'L', color: 'black', quantity: 10 },
    ],
    material: { tr: '78% Polyamid, 22% Elastan', en: '78% Polyamide, 22% Elastane' },
    care: { tr: 'Elle veya 30°C makinede yıkayın', en: 'Hand wash or machine wash at 30°C' },
    isNew: true,
    isFeatured: true,
    isBestseller: false,
    tags: ['shapewear', 'waist', 'sculpting'],
    sku: 'SHW-001',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    slug: 'lace-trim-bralette',
    name: { tr: 'Dantel Detaylı Bralette', en: 'Lace Trim Bralette' },
    description: {
      tr: 'Zarif dantel detaylarıyla süslenmiş konforlu bralette. Tel içermeyen tasarımı ile günlük kullanıma ideal.',
      en: 'Comfortable bralette adorned with elegant lace details. Wire-free design ideal for everyday wear.',
    },
    price: 329,
    salePrice: 249,
    images: [
      'https://images.unsplash.com/photo-1616430888526-4fd40e9f1c1b?w=800',
      'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=800',
    ],
    category: 'bras',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'blush', hex: '#F2C4C4', label: { tr: 'Pudra', en: 'Blush' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
      { name: 'ivory', hex: '#FFFFF0', label: { tr: 'Kırık Beyaz', en: 'Ivory' } },
    ],
    stock: [
      { size: 'XS', color: 'blush', quantity: 8 },
      { size: 'S', color: 'blush', quantity: 15 },
      { size: 'M', color: 'blush', quantity: 12 },
      { size: 'L', color: 'blush', quantity: 7 },
      { size: 'S', color: 'black', quantity: 20 },
      { size: 'M', color: 'black', quantity: 18 },
      { size: 'L', color: 'black', quantity: 14 },
      { size: 'XL', color: 'black', quantity: 8 },
    ],
    material: { tr: '90% Polyamid, 10% Elastan, Dantel Aksesuar', en: '90% Polyamide, 10% Elastane, Lace Trim' },
    care: { tr: 'Elle yıkayın', en: 'Hand wash only' },
    isNew: true,
    isFeatured: true,
    isBestseller: true,
    tags: ['bra', 'lace', 'wireless'],
    sku: 'BRA-001',
    createdAt: '2024-02-10',
  },
  {
    id: '4',
    slug: 'high-waist-briefs-set',
    name: { tr: 'Yüksek Bel Külot Takımı', en: 'High Waist Briefs Set' },
    description: {
      tr: '3\'lü yüksek bel külot seti. Nefes alabilen pamuklu iç astar ile gün boyu konfor sağlar.',
      en: '3-piece high waist briefs set. Breathable cotton inner lining provides all-day comfort.',
    },
    price: 459,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800',
    ],
    category: 'briefs',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
      { name: 'blush', hex: '#F2C4C4', label: { tr: 'Pudra', en: 'Blush' } },
    ],
    stock: [
      { size: 'S', color: 'nude', quantity: 20 },
      { size: 'M', color: 'nude', quantity: 25 },
      { size: 'L', color: 'nude', quantity: 18 },
      { size: 'S', color: 'black', quantity: 22 },
      { size: 'M', color: 'black', quantity: 20 },
      { size: 'L', color: 'black', quantity: 15 },
    ],
    material: { tr: '95% Pamuk, 5% Elastan', en: '95% Cotton, 5% Elastane' },
    care: { tr: '40°C makinede yıkayın', en: 'Machine wash at 40°C' },
    isNew: false,
    isFeatured: false,
    isBestseller: true,
    tags: ['briefs', 'highwaist', 'set'],
    sku: 'BRF-001',
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    slug: 'luxury-bodysuit-set',
    name: { tr: 'Lüks Bodysuit Takımı', en: 'Luxury Bodysuit Set' },
    description: {
      tr: 'Bralette ve külottan oluşan lüks takım. İnce dantel detaylar ve premium kumaş kalitesiyle her gün kendinizi özel hissettirin.',
      en: 'Luxury set consisting of bralette and briefs. Fine lace details and premium fabric quality make every day feel special.',
    },
    price: 899,
    salePrice: 699,
    images: [
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800',
      'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=800',
    ],
    category: 'sets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
      { name: 'blush', hex: '#F2C4C4', label: { tr: 'Pudra', en: 'Blush' } },
      { name: 'ivory', hex: '#FFFFF0', label: { tr: 'Kırık Beyaz', en: 'Ivory' } },
    ],
    stock: [
      { size: 'XS', color: 'black', quantity: 5 },
      { size: 'S', color: 'black', quantity: 10 },
      { size: 'M', color: 'black', quantity: 12 },
      { size: 'L', color: 'black', quantity: 8 },
      { size: 'S', color: 'blush', quantity: 8 },
      { size: 'M', color: 'blush', quantity: 10 },
      { size: 'L', color: 'blush', quantity: 6 },
    ],
    material: { tr: '88% Polyamid, 12% Elastan, Dantel Aksesuar', en: '88% Polyamide, 12% Elastane, Lace Trim' },
    care: { tr: 'Elle yıkayın, doğrudan güneş ışığından koruyun', en: 'Hand wash, protect from direct sunlight' },
    isNew: true,
    isFeatured: true,
    isBestseller: false,
    tags: ['set', 'luxury', 'lace'],
    sku: 'SET-001',
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    slug: 'full-body-shaper',
    name: { tr: 'Tam Vücut Şekillendirici', en: 'Full Body Shaper' },
    description: {
      tr: 'Boyundan bacaklara kadar tam vücut şekillendirme sağlayan özel tasarım. Açılabilir kasık bölümü ile pratik kullanım.',
      en: 'Special design providing full-body shaping from neck to thighs. Open-crotch design for practical use.',
    },
    price: 1099,
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800',
    ],
    category: 'shapewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
    ],
    stock: [
      { size: 'S', color: 'nude', quantity: 8 },
      { size: 'M', color: 'nude', quantity: 12 },
      { size: 'L', color: 'nude', quantity: 10 },
      { size: 'XL', color: 'nude', quantity: 5 },
      { size: 'S', color: 'black', quantity: 10 },
      { size: 'M', color: 'black', quantity: 14 },
      { size: 'L', color: 'black', quantity: 8 },
    ],
    material: { tr: '72% Polyamid, 28% Elastan', en: '72% Polyamide, 28% Elastane' },
    care: { tr: 'Elle yıkayın, askıda kurutun', en: 'Hand wash, hang to dry' },
    isNew: false,
    isFeatured: true,
    isBestseller: true,
    tags: ['shapewear', 'fullbody', 'slimming'],
    sku: 'SHW-002',
    createdAt: '2024-01-10',
  },
  {
    id: '7',
    slug: 'push-up-bodysuit',
    name: { tr: 'Push-Up Bodysuit', en: 'Push-Up Bodysuit' },
    description: {
      tr: 'Yükseltici dolgulu fincanları ile mükemmel dekoltaj. Çıkarılabilir askılar ve çıt çıt kapatma sistemi.',
      en: 'Perfect décolletage with lift-enhancing padded cups. Removable straps and snap closure system.',
    },
    price: 629,
    salePrice: 489,
    images: [
      'https://images.unsplash.com/photo-1558171813-57d44e2a5db0?w=800',
    ],
    category: 'bodysuits',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'burgundy', hex: '#800020', label: { tr: 'Bordo', en: 'Burgundy' } },
    ],
    stock: [
      { size: 'XS', color: 'black', quantity: 7 },
      { size: 'S', color: 'black', quantity: 14 },
      { size: 'M', color: 'black', quantity: 16 },
      { size: 'L', color: 'black', quantity: 10 },
      { size: 'XL', color: 'black', quantity: 4 },
      { size: 'S', color: 'nude', quantity: 12 },
      { size: 'M', color: 'nude', quantity: 10 },
      { size: 'L', color: 'nude', quantity: 8 },
    ],
    material: { tr: '82% Polyamid, 18% Elastan', en: '82% Polyamide, 18% Elastane' },
    care: { tr: '30°C makinede yıkayın', en: 'Machine wash at 30°C' },
    isNew: true,
    isFeatured: false,
    isBestseller: true,
    tags: ['bodysuit', 'pushup', 'padded'],
    sku: 'BST-002',
    createdAt: '2024-02-20',
  },
  {
    id: '8',
    slug: 'thigh-slimmer-shorts',
    name: { tr: 'Uyluk İncelten Şort', en: 'Thigh Slimmer Shorts' },
    description: {
      tr: 'Uyluklarınızı ve kalçalarınızı şekillendiren konforlu şort. Anti-kabarcık özelliği ile gün boyu yerinde kalır.',
      en: 'Comfortable shorts that shape your thighs and hips. Anti-roll feature stays in place all day.',
    },
    price: 389,
    images: [
      'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=800',
    ],
    category: 'shapewear',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'nude', hex: '#D4A896', label: { tr: 'Ten Rengi', en: 'Nude' } },
      { name: 'black', hex: '#1A1A1A', label: { tr: 'Siyah', en: 'Black' } },
    ],
    stock: [
      { size: 'S', color: 'nude', quantity: 18 },
      { size: 'M', color: 'nude', quantity: 22 },
      { size: 'L', color: 'nude', quantity: 16 },
      { size: 'XL', color: 'nude', quantity: 8 },
      { size: 'S', color: 'black', quantity: 20 },
      { size: 'M', color: 'black', quantity: 24 },
      { size: 'L', color: 'black', quantity: 18 },
    ],
    material: { tr: '80% Polyamid, 20% Elastan', en: '80% Polyamide, 20% Elastane' },
    care: { tr: '30°C makinede yıkayın', en: 'Machine wash at 30°C' },
    isNew: false,
    isFeatured: false,
    isBestseller: false,
    tags: ['shapewear', 'shorts', 'thigh'],
    sku: 'SHW-003',
    createdAt: '2024-01-25',
  },
];

export const LOYALTY_REWARDS = [
  { points: 2500,  discount: 50,   label: { tr: '50₺ İndirim',      en: '50₺ Discount'    } },
  { points: 5000,  discount: 150,  label: { tr: '150₺ İndirim',     en: '150₺ Discount'   } },
  { points: 10000, discount: 400,  label: { tr: '400₺ İndirim',     en: '400₺ Discount'   } },
  { points: 20000, discount: 1000, label: { tr: '1.000₺ İndirim',   en: '1.000₺ Discount' } },
] as const;

export const WELCOME5_CODE: DiscountCode = {
  id: 'welcome5',
  code: 'WELCOME5',
  type: 'percentage',
  value: 5,
  minOrder: undefined,
  maxUses: undefined,
  usedCount: 0,
  expiryDate: '2099-12-31',
  isActive: true,
};

export const DISCOUNT_CODES: DiscountCode[] = [
  WELCOME5_CODE,
  {
    id: '1',
    code: 'HARMONY10',
    type: 'percentage',
    value: 10,
    minOrder: 200,
    maxUses: 100,
    usedCount: 23,
    expiryDate: '2027-12-31',
    isActive: true,
  },
  {
    id: '2',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrder: 300,
    maxUses: 50,
    usedCount: 12,
    expiryDate: '2027-12-31',
    isActive: true,
  },
  {
    id: '3',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    minOrder: 400,
    maxUses: 200,
    usedCount: 45,
    isActive: true,
  },
];

export const BANNERS: Banner[] = [
  {
    id: '1',
    title: { tr: 'Yeni Sezon Koleksiyonu', en: 'New Season Collection' },
    subtitle: { tr: 'Kendinizi en iyi hissettiren seçimler', en: 'Choices that make you feel your best' },
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=80',
    link: '/products',
    order: 1,
    isActive: true,
    buttonText: { tr: 'Alışverişe Başla', en: 'Start Shopping' },
  },
  {
    id: '2',
    title: { tr: '%30\'a Varan İndirim', en: 'Up to 30% Off' },
    subtitle: { tr: 'Seçili ürünlerde büyük indirimler', en: 'Great discounts on selected products' },
    image: 'https://images.unsplash.com/photo-1558171813-57d44e2a5db0?w=1920&q=80',
    link: '/products?sale=true',
    order: 2,
    isActive: true,
    buttonText: { tr: 'İndirimleri Gör', en: 'See Discounts' },
  },
  {
    id: '3',
    title: { tr: 'Premium Shapewear', en: 'Premium Shapewear' },
    subtitle: { tr: 'Vücudunuzun doğal güzelliğini ortaya çıkarın', en: 'Reveal your body\'s natural beauty' },
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=1920&q=80',
    link: '/products?category=shapewear',
    order: 3,
    isActive: true,
    buttonText: { tr: 'Keşfet', en: 'Explore' },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.isFeatured);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter(p => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter(p => p.isNew);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getStockForSizeColor(product: Product, size: string, color: string): number {
  const stockItem = product.stock.find(s => s.size === size && s.color === color);
  return stockItem?.quantity ?? 0;
}

export function validateDiscountCode(
  code: string,
  orderTotal: number,
  discounts: DiscountCode[] = DISCOUNT_CODES
): DiscountCode | null {
  console.log('[validateDiscountCode] code:', code, '| orderTotal:', orderTotal, '| checking', discounts.length, 'discounts');
  const discount = discounts.find(
    d => d.code.toLowerCase() === code.toLowerCase() && d.isActive
  );
  if (!discount) {
    console.log('[validateDiscountCode] FAIL: code not found or inactive. Available codes:', discounts.map(d => d.code));
    return null;
  }
  if (discount.minOrder && orderTotal < discount.minOrder) {
    console.log('[validateDiscountCode] FAIL: minOrder not met —', orderTotal, '<', discount.minOrder);
    return null;
  }
  if (discount.expiryDate && new Date(discount.expiryDate) < new Date()) {
    console.log('[validateDiscountCode] FAIL: code expired —', discount.expiryDate);
    return null;
  }
  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    console.log('[validateDiscountCode] FAIL: max uses reached —', discount.usedCount, '>=', discount.maxUses);
    return null;
  }
  console.log('[validateDiscountCode] PASS:', discount);
  return discount;
}

export function calculateDiscount(discount: DiscountCode, orderTotal: number): number {
  if (discount.type === 'percentage') {
    return (orderTotal * discount.value) / 100;
  }
  return discount.value;
}
