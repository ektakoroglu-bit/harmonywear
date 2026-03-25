'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ShopLayout from '@/components/layout/ShopLayout';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const locale = useLocale();
  const t = useTranslations('checkout');
  const router = useRouter();
  const items = useCartStore(state => state.items);
  const currentUser = useUserStore(state => state.currentUser);

  useEffect(() => {
    if (!currentUser) {
      toast.error(locale === 'tr' ? 'Sipariş verebilmek için giriş yapmanız gerekmektedir.' : 'You need to log in to place an order.');
      router.replace(`/${locale}/account/login`);
    }
  }, [currentUser, locale, router]);

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <ShoppingBag size={48} className="text-rose-blush mb-4" />
          <h1 className="font-serif text-xl font-bold text-charcoal mb-4">
            {locale === 'tr' ? 'Sepetiniz boş' : 'Your cart is empty'}
          </h1>
          <Link
            href={`/${locale}/products`}
            className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-charcoal-light transition-colors"
          >
            {locale === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/${locale}/cart`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-charcoal">{t('title')}</h1>
        </div>
        <CheckoutForm />
      </div>
    </ShopLayout>
  );
}
