'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import ShopLayout from '@/components/layout/ShopLayout';

function SuccessContent() {
  const locale = useLocale();
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-3">{t('success')}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{t('successMessage')}</p>
        {orderId && (
          <div className="bg-cream rounded-2xl p-5 mb-8">
            <div className="flex items-center justify-center gap-2 text-charcoal">
              <Package size={18} className="text-rose-deep" />
              <span className="text-sm font-medium">{t('orderNumber')}</span>
            </div>
            <p className="font-mono font-bold text-xl text-charcoal mt-2 tracking-wider">{orderId}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}`} className="flex items-center justify-center gap-2 bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-charcoal-light transition-colors">
            {t('backToHome')}
          </Link>
          <Link href={`/${locale}/products`} className="flex items-center justify-center gap-2 border border-charcoal text-charcoal px-8 py-3 rounded-full text-sm font-semibold hover:bg-cream transition-colors">
            {locale === 'tr' ? 'Alışverişe Devam Et' : 'Continue Shopping'}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <ShopLayout>
      <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-rose-blush border-t-transparent rounded-full" /></div>}>
        <SuccessContent />
      </Suspense>
    </ShopLayout>
  );
}
