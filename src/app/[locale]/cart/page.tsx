'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import ShopLayout from '@/components/layout/ShopLayout';

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('cart');
  const items = useCartStore(state => state.items);

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="w-24 h-24 bg-rose-pale rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-rose-blush" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">{t('empty')}</h1>
          <p className="text-gray-500 mb-8 text-center max-w-sm">{t('emptySubtitle')}</p>
          <Link
            href={`/${locale}/products`}
            className="flex items-center gap-2 bg-charcoal text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-charcoal-light transition-colors"
          >
            <ArrowLeft size={16} />
            {t('continueShopping')}
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-serif text-3xl font-bold text-charcoal">{t('title')}</h1>
          <span className="bg-rose-blush text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-semibold">
            {items.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 px-4 sm:px-6">
              {items.map((item, idx) => (
                <CartItem key={`${item.product.id}-${item.size}-${item.color.name}-${idx}`} item={item} />
              ))}
            </div>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors mt-4"
            >
              <ArrowLeft size={15} />
              {t('continueShopping')}
            </Link>
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
