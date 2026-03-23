'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Heart, Share2, Truck, RotateCcw, ShieldCheck, Minus, Plus, Star, Bell, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import { getStockForSizeColor } from '@/lib/products';
import { ProductColor, ProductSize } from '@/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import ShopLayout from '@/components/layout/ShopLayout';
import toast from 'react-hot-toast';

// ─── Markdown renderer ────────────────────────────────────────────────────────
function RichText({ text, className }: { text: string; className?: string }) {
  if (!text?.trim()) return null;
  const renderInline = (str: string): React.ReactNode[] =>
    str.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
    );
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  const flushList = (k: number) => {
    if (!listBuffer.length) return;
    nodes.push(<ul key={`ul-${k}`} className="list-disc list-inside space-y-0.5">{listBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}</ul>);
    listBuffer = [];
  };
  lines.forEach((line, i) => {
    if (line.startsWith('- ')) { listBuffer.push(line.slice(2)); }
    else { flushList(i); if (line.trim()) nodes.push(<p key={i}>{renderInline(line)}</p>); }
  });
  flushList(lines.length);
  return <div className={cn('space-y-1.5', className)}>{nodes}</div>;
}

// ─── Star display ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

// ─── Interactive star picker ──────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          <Star
            size={22}
            className={s <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 fill-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('product');
  const tp = useTranslations('products');
  const addItem = useCartStore(state => state.addItem);
  const adminProducts = useAdminStore(state => state.products);
  const allReviews = useAdminStore(state => state.reviews);
  const addReview = useAdminStore(state => state.addReview);
  const addStockNotification = useAdminStore(state => state.addStockNotification);
  const orders = useAdminStore(state => state.orders);
  const currentUser = useUserStore(state => state.currentUser);

  const product = adminProducts.find(p => p.slug === params.slug);
  const related = adminProducts.filter(p => p.id !== product?.id && p.category === product?.category).slice(0, 4);
  if (!product) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'care'>('description');
  const [sizeError, setSizeError] = useState('');
  const [colorError, setColorError] = useState('');
  // Stock notification inline form
  const [notifEmail, setNotifEmail] = useState('');
  const [notifSubmitted, setNotifSubmitted] = useState(false);
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const price = product.salePrice ?? product.price;
  const isOnSale = !!product.salePrice;
  const discountPct = isOnSale ? getDiscountPercentage(product.price, product.salePrice!) : 0;

  const stockForSelection = selectedSize && selectedColor
    ? getStockForSizeColor(product, selectedSize, selectedColor.name)
    : null;

  const isOos = stockForSelection !== null && stockForSelection <= 0;

  const handleStockNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifEmail.trim() || !/\S+@\S+\.\S+/.test(notifEmail)) return;
    addStockNotification({
      productId: product.id,
      productName: product.name[locale],
      size: selectedSize!,
      colorName: selectedColor!.label[locale],
      colorHex: selectedColor!.hex,
      email: notifEmail.trim(),
    });
    setNotifSubmitted(true);
  };

  // Reviews
  const approvedReviews = allReviews.filter(r => r.productId === product.id && r.status === 'approved');
  const avgRating = approvedReviews.length
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length : 0;

  // Check if current user has purchased this product
  const hasPurchased = currentUser
    ? orders.some(o =>
        o.customer.email === currentUser.email &&
        o.items.some(i => i.product.id === product.id)
      )
    : false;

  const hasAlreadyReviewed = currentUser
    ? allReviews.some(r => r.productId === product.id && r.userId === currentUser.id)
    : false;

  const handleAddToCart = () => {
    let valid = true;
    if (!selectedColor) { setColorError('Lütfen renk seçiniz'); valid = false; }
    if (!selectedSize) { setSizeError('Lütfen beden seçiniz'); valid = false; }
    if (!valid) return;
    if (stockForSelection !== null && stockForSelection <= 0) {
      toast.error(locale === 'tr' ? 'Bu seçenek stokta yok' : 'Out of stock');
      return;
    }
    addItem(product, selectedSize!, selectedColor!, quantity);
    toast.success(`${product.name[locale]} ${tp('addedToCart')}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !reviewComment.trim()) return;
    const purchaseOrder = orders.find(o =>
      o.customer.email === currentUser.email &&
      o.items.some(i => i.product.id === product.id)
    );
    addReview({
      productId: product.id,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      orderId: purchaseOrder?.id ?? '',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewSubmitted(true);
    toast.success('Yorumunuz incelemeye alındı.');
  };

  const description = product.description?.[locale] ?? '';
  const isDataUrl = (src: string) => src.startsWith('data:');

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={product.images[activeImage]}
                alt={product.name[locale]}
                fill
                unoptimized={isDataUrl(product.images[activeImage])}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">{locale === 'tr' ? 'Yeni' : 'New'}</Badge>}
                {isOnSale && <Badge variant="sale">-{discountPct}%</Badge>}
              </div>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart size={18} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
              </button>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn('relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-colors',
                      activeImage === idx ? 'border-charcoal' : 'border-transparent hover:border-gray-300')}
                  >
                    <Image src={img} alt={`${idx + 1}`} fill unoptimized={isDataUrl(img)} className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-rose-deep uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight">{product.name[locale]}</h1>
              <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
              {description && (
                <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                  <RichText text={description} />
                </div>
              )}
            </div>

            {/* Rating summary */}
            {approvedReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Stars rating={avgRating} size={16} />
                <span className="text-sm font-semibold text-charcoal">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({approvedReviews.length} yorum)</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-charcoal">{formatPrice(price)}</span>
              {isOnSale && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <Badge variant="sale">-{discountPct}%</Badge>
                </>
              )}
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-semibold text-charcoal mb-3">
                {t('selectColor')}
                {selectedColor && <span className="font-normal text-gray-600 ml-1">{selectedColor.label[locale]}</span>}
              </p>
              <div className="flex gap-2.5">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => { setSelectedColor(color); setColorError(''); }}
                    title={color.label[locale]}
                    className={cn('w-9 h-9 rounded-full border-2 transition-all hover:scale-110',
                      selectedColor?.name === color.name ? 'ring-2 ring-charcoal ring-offset-2 scale-110' : 'ring-1 ring-gray-200')}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              {colorError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><span>⚠</span> {colorError}</p>}
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-charcoal">{t('selectSize')}</p>
                <button className="text-xs text-rose-deep hover:underline">{t('sizeGuide')}</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const stock = selectedColor ? getStockForSizeColor(product, size, selectedColor.name) : 0;
                  const outOfStock = selectedColor ? stock === 0 : false;
                  return (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(''); setNotifEmail(''); setNotifSubmitted(false); }}
                      className={cn('px-4 py-2 border rounded-xl text-sm font-medium transition-all',
                        selectedSize === size && outOfStock ? 'border-gray-400 bg-gray-100 text-gray-400 line-through' :
                        selectedSize === size ? 'border-charcoal bg-charcoal text-white' :
                        outOfStock ? 'border-gray-100 text-gray-300 line-through hover:border-gray-300' :
                        sizeError ? 'border-red-300 text-charcoal hover:border-red-400' :
                        'border-gray-200 text-charcoal hover:border-charcoal')}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><span>⚠</span> {sizeError}</p>}
              {!sizeError && isOos && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {locale === 'tr' ? 'Bu beden/renk kombinasyonu stokta yok.' : 'This size/color combination is out of stock.'}
                </p>
              )}
              {!sizeError && stockForSelection !== null && stockForSelection > 0 && stockForSelection <= 5 && (
                <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                  <span className="text-base leading-none">⚠️</span>
                  <p className="text-sm font-semibold text-amber-700">
                    {locale === 'tr' ? 'Son birkaç ürün kaldı! Hemen sipariş verin.' : 'Only a few items left! Order now.'}
                  </p>
                </div>
              )}

            </div>

            {/* Quantity */}
            {!isOos && (
              <div>
                <p className="text-sm font-semibold text-charcoal mb-3">{t('quantity')}</p>
                <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2.5 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                  <span className="w-12 text-center font-medium text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2.5 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                </div>
              </div>
            )}

            {isOos && selectedSize && selectedColor ? (
              /* ── Out-of-stock: inline notification form ── */
              <div className="bg-mint-pale border border-mint-light rounded-2xl p-4 space-y-3">
                {notifSubmitted ? (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-9 h-9 bg-mint-light rounded-full flex items-center justify-center shrink-0">
                      <Bell size={17} className="text-mint-darker" />
                    </div>
                    <p className="text-sm text-mint-darker font-medium leading-snug">
                      {locale === 'tr' ? 'Stok geldiğinde e-posta adresinize bildirim göndereceğiz!' : 'We\'ll notify you by email when this item is back in stock!'}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-charcoal flex items-center gap-2">
                      <Bell size={15} className="text-mint-darker" />
                      {locale === 'tr' ? 'Stok Gelince Haber Ver' : 'Notify Me When Available'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {locale === 'tr' ? 'Bu beden/renk stoka girince sizi bilgilendirelim.' : 'We\'ll let you know when this size/color is back in stock.'}
                    </p>
                    <form onSubmit={handleStockNotify} className="flex gap-2">
                      <input
                        type="email"
                        value={notifEmail}
                        onChange={e => setNotifEmail(e.target.value)}
                        placeholder={locale === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                        required
                        className="flex-1 border border-mint-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mint-dark bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-charcoal-light transition-colors whitespace-nowrap"
                      >
                        {locale === 'tr' ? 'Haber Ver' : 'Notify Me'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <ShoppingBag size={18} />
                  {t('addToCart')}
                </Button>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={cn('w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all',
                    wishlisted ? 'border-rose-400 bg-rose-50' : 'border-gray-200 hover:border-rose-300')}
                >
                  <Heart size={20} className={wishlisted ? 'fill-rose-400 text-rose-400' : 'text-gray-400'} />
                </button>
                <button className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors text-gray-400">
                  <Share2 size={18} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 bg-cream rounded-2xl p-4">
              <div className="text-center"><Truck size={18} className="text-rose-deep mx-auto mb-1" /><p className="text-xs font-medium text-charcoal">{t('freeShipping')}</p></div>
              <div className="text-center"><RotateCcw size={18} className="text-rose-deep mx-auto mb-1" /><p className="text-xs font-medium text-charcoal">{t('returnPolicy')}</p></div>
              <div className="text-center"><ShieldCheck size={18} className="text-rose-deep mx-auto mb-1" /><p className="text-xs font-medium text-charcoal">{locale === 'tr' ? 'Güvenli' : 'Secure'}</p></div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200 gap-6">
                {(['description', 'details', 'care'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn('pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                      activeTab === tab ? 'border-charcoal text-charcoal' : 'border-transparent text-gray-500 hover:text-charcoal')}
                  >
                    {tab === 'description' ? t('description') : tab === 'details' ? t('details') : t('care')}
                  </button>
                ))}
              </div>
              <div className="pt-4 text-sm text-gray-600 leading-relaxed">
                {activeTab === 'description' && <RichText text={product.description?.[locale] ?? ''} />}
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p><span className="font-medium text-charcoal">{t('material')}:</span> {product.material[locale]}</p>
                    <p><span className="font-medium text-charcoal">SKU:</span> {product.sku}</p>
                  </div>
                )}
                {activeTab === 'care' && product.care[locale]}
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews section ────────────────────────────────────────────── */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Yorumlar</h2>
            {approvedReviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Stars rating={avgRating} size={18} />
                <span className="text-lg font-bold text-charcoal">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">/ 5 ({approvedReviews.length} yorum)</span>
              </div>
            )}
          </div>

          {/* Approved reviews list */}
          {approvedReviews.length === 0 ? (
            <p className="text-gray-400 text-sm mb-8">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
          ) : (
            <div className="grid gap-4 mb-10">
              {approvedReviews.map(review => (
                <div key={review.id} className="bg-cream rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-charcoal text-sm">{review.userName}</p>
                      <Stars rating={review.rating} size={13} />
                    </div>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Write review */}
          {!currentUser && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-3">Yorum yapmak için giriş yapmanız ve bu ürünü satın almış olmanız gerekir.</p>
            </div>
          )}
          {currentUser && !hasPurchased && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500">Bu ürünü satın alan müşteriler yorum yapabilir.</p>
            </div>
          )}
          {currentUser && hasPurchased && !hasAlreadyReviewed && !reviewSubmitted && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold text-charcoal mb-4">Yorumunuzu Yazın</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Puanınız</label>
                  <StarPicker value={reviewRating} onChange={setReviewRating} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Yorumunuz</label>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                    required
                    placeholder="Bu ürün hakkındaki düşüncelerinizi paylaşın..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush resize-none"
                  />
                </div>
                <Button type="submit" disabled={!reviewComment.trim()}>Yorum Gönder</Button>
              </form>
            </div>
          )}
          {(hasAlreadyReviewed || reviewSubmitted) && (
            <div className="bg-mint-pale border border-mint-light rounded-2xl p-4 text-sm text-mint-darker">
              Yorumunuz incelemeye alındı. Onaylandıktan sonra yayınlanacak.
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <FeaturedProducts products={related} title={t('relatedProducts')} />
          </div>
        )}
      </div>

    </ShopLayout>
  );
}
