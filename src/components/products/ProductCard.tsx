'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, ShoppingBag, Eye, X, Minus, Plus, Star } from 'lucide-react';
import { Product, ProductSize, ProductColor } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { getStockForSizeColor } from '@/lib/products';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('products');
  const addItem = useCartStore(state => state.addItem);
  const reviews = useAdminStore(state => state.reviews);
  const approvedReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
  const avgRating = approvedReviews.length
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
    : 0;
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState('');
  const [colorError, setColorError] = useState('');

  const name = product.name[locale];
  const price = product.salePrice ?? product.price;
  const isOnSale = !!product.salePrice;
  const discountPct = isOnSale ? getDiscountPercentage(product.price, product.salePrice!) : 0;

  const totalStock = product.stock.reduce((sum, s) => sum + s.quantity, 0);
  const inStock = totalStock > 0;

  const stockForSelection = selectedSize && selectedColor
    ? getStockForSizeColor(product, selectedSize, selectedColor.name)
    : null;

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setSizeError('');
    setColorError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleModalAddToCart = () => {
    let valid = true;
    if (!selectedColor) { setColorError('Lütfen renk seçiniz'); valid = false; }
    if (!selectedSize) { setSizeError('Lütfen beden seçiniz'); valid = false; }
    if (!valid) return;
    if (stockForSelection !== null && stockForSelection <= 0) {
      toast.error(locale === 'tr' ? 'Bu seçenek stokta yok' : 'Out of stock');
      return;
    }
    addItem(product, selectedSize!, selectedColor!, quantity);
    toast.success(`${name} ${t('addedToCart')}`);
    closeModal();
  };

  return (
    <>
      <div className={cn('group relative', className)}>
        {/* Cover link */}
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="absolute inset-0 z-[1] rounded-2xl"
          aria-label={name}
        />

        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={product.images[imgIdx] || product.images[0]}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onMouseEnter={() => product.images[1] && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-[2]">
            {product.isNew && <Badge variant="new">{t('onSale') === 'On Sale' ? 'New' : 'Yeni'}</Badge>}
            {isOnSale && <Badge variant="sale">-{discountPct}%</Badge>}
            {product.isBestseller && !isOnSale && !product.isNew && (
              <Badge variant="bestseller">{locale === 'tr' ? 'Çok Satan' : 'Best'}</Badge>
            )}
            {!inStock && <Badge variant="outofstock">{t('outOfStock')}</Badge>}
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="absolute top-3 right-3 z-[2] w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          >
            <Heart size={14} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
          </button>

          {/* Quick actions */}
          <div className="absolute bottom-3 left-3 right-3 z-[2] flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={openModal}
              disabled={!inStock}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                inStock
                  ? 'bg-charcoal text-white hover:bg-charcoal-light'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <ShoppingBag size={13} />
              {t('addToCart')}
            </button>
            <Link
              href={`/${locale}/products/${product.slug}`}
              className="w-10 flex items-center justify-center bg-white text-charcoal rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          <h3 className="font-medium text-charcoal text-sm leading-snug line-clamp-2 group-hover:text-rose-deep transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-semibold text-charcoal text-sm">
              {formatPrice(price)}
            </span>
            {isOnSale && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {approvedReviews.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-600 font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({approvedReviews.length})</span>
            </div>
          )}
          {/* Color dots */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map(color => (
              <span
                key={color.name}
                className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: color.hex }}
                title={color.label[locale]}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick-add modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Product header */}
              <div className="flex gap-4 p-5 pb-4 border-b border-gray-100">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={product.images[0]} alt={name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="pt-1">
                  <p className="text-xs font-semibold text-rose-deep uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-semibold text-charcoal text-sm leading-snug line-clamp-2">{name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-charcoal">{formatPrice(price)}</span>
                    {isOnSale && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Color */}
                <div>
                  <p className="text-xs font-semibold text-charcoal mb-2">
                    {locale === 'tr' ? 'Renk' : 'Color'}
                    {selectedColor && <span className="font-normal text-gray-500 ml-1">{selectedColor.label[locale]}</span>}
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => { setSelectedColor(color); setColorError(''); }}
                        title={color.label[locale]}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                          selectedColor?.name === color.name
                            ? 'ring-2 ring-charcoal ring-offset-2 scale-110'
                            : colorError ? 'ring-1 ring-red-300' : 'ring-1 ring-gray-200'
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  {colorError && <p className="text-xs text-red-500 mt-1.5">⚠ {colorError}</p>}
                </div>

                {/* Size */}
                <div>
                  <p className="text-xs font-semibold text-charcoal mb-2">{locale === 'tr' ? 'Beden' : 'Size'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map(size => {
                      const stock = selectedColor ? getStockForSizeColor(product, size, selectedColor.name) : 0;
                      const oos = stock === 0;
                      return (
                        <button
                          key={size}
                          onClick={() => { if (!oos) { setSelectedSize(size); setSizeError(''); } }}
                          disabled={oos}
                          className={cn(
                            'px-3 py-1.5 border rounded-lg text-xs font-medium transition-all',
                            selectedSize === size
                              ? 'border-charcoal bg-charcoal text-white'
                              : oos
                              ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                              : sizeError
                              ? 'border-red-300 text-charcoal hover:border-red-400'
                              : 'border-gray-200 text-charcoal hover:border-charcoal'
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError && <p className="text-xs text-red-500 mt-1.5">⚠ {sizeError}</p>}
                  {!sizeError && stockForSelection === 0 && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                      {locale === 'tr' ? 'Bu beden/renk kombinasyonu stokta yok.' : 'This size/color is out of stock.'}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-charcoal">{locale === 'tr' ? 'Adet' : 'Quantity'}</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={handleModalAddToCart}
                  disabled={stockForSelection !== null && stockForSelection <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  {t('addToCart')}
                </button>

                <Link
                  href={`/${locale}/products/${product.slug}`}
                  onClick={closeModal}
                  className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {locale === 'tr' ? 'Ürün detaylarını gör →' : 'View full details →'}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
