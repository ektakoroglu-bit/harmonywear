'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Tag, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartSummary() {
  const locale = useLocale();
  const t = useTranslations('cart');
  const { items, getShipping, getTotal, getDiscountAmount, discountCode, discountMinOrder, applyDiscount, removeDiscount } = useCartStore();
  const adminDiscounts = useAdminStore(state => state.discounts);
  const currentUser = useUserStore(state => state.currentUser);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Compute subtotal directly from items so the component re-renders reactively
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity,
    0
  );

  // Auto-remove discount when subtotal drops below minimum order requirement
  useEffect(() => {
    if (discountCode && discountMinOrder !== null && subtotal < discountMinOrder) {
      removeDiscount();
      toast.error(
        locale === 'tr'
          ? `İndirim kodu kaldırıldı: minimum sipariş tutarı ${discountMinOrder}₺`
          : `Discount removed: minimum order of ${discountMinOrder}₺ not met`
      );
    }
  }, [subtotal, discountCode, discountMinOrder, removeDiscount, locale]);

  const shipping = getShipping();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const freeShippingRemaining = Math.max(0, 1000 - subtotal);

  const handleApplyCode = () => {
    setError('');
    if (!code.trim()) return;
    if (code.trim().toUpperCase() === 'WELCOME5' && !currentUser) {
      setError(locale === 'tr' ? 'Bu kod yalnızca hesap oluşturan üyeler için geçerlidir.' : 'This code is only valid for members who have created an account.');
      return;
    }
    const success = applyDiscount(code.trim(), adminDiscounts);
    if (success) {
      toast.success(`${code.toUpperCase()} kodu uygulandı!`);
      setCode('');
    } else {
      setError(t('invalidCode'));
    }
  };

  return (
    <div className="bg-cream rounded-2xl p-6 space-y-4 sticky top-24">
      <h2 className="font-semibold text-charcoal text-lg">{t('orderSummary') || 'Özet'}</h2>

      {/* Free shipping progress */}
      <ShippingProgress />

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1.5"><Truck size={14} />{t('shipping')}</span>
          <span className={shipping === 0 ? 'text-emerald-600 font-medium' : ''}>
            {shipping === 0 ? t('freeShipping') : formatPrice(shipping)}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span className="flex items-center gap-1.5">
              <Tag size={14} />
              {discountCode === 'WELCOME5'
                ? (locale === 'tr' ? 'Hoşgeldin İndirimi' : 'Welcome Discount')
                : discountCode}
              <button onClick={removeDiscount} className="text-xs text-red-400 hover:text-red-500 ml-1">×</button>
            </span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      <div className="flex justify-between font-semibold text-charcoal text-base">
        <span>{t('total')}</span>
        <span>{formatPrice(total)}</span>
      </div>

      {/* Discount code */}
      {!discountCode && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleApplyCode()}
              placeholder={t('discountCode')}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
            />
            <button
              onClick={handleApplyCode}
              className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-charcoal-light transition-colors"
            >
              {t('apply')}
            </button>
          </div>
          {error && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle size={12} /> {error}
            </p>
          )}
        </div>
      )}

      <Link
        href={`/${locale}/checkout`}
        className="w-full flex items-center justify-center gap-2 bg-charcoal text-white py-4 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors"
      >
        {t('checkout')}
      </Link>

      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        {locale === 'tr' ? 'Güvenli Ödeme - SSL Şifreli' : 'Secure Payment - SSL Encrypted'}
      </p>
    </div>
  );
}

function ShippingProgress() {
  const items = useCartStore(state => state.items);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity,
    0
  );
  const FREE_SHIPPING = 1000;
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const barWidth = subtotal > 0 ? Math.max(5, Math.min(100, (subtotal / FREE_SHIPPING) * 100)) : 0;
  const unlocked = subtotal >= FREE_SHIPPING;

  let message: React.ReactNode;
  if (unlocked) {
    message = (
      <span className="font-semibold text-emerald-600">
        Tebrikler! Ücretsiz kargo kazandınız! 🚚
      </span>
    );
  } else if (subtotal >= 500) {
    message = (
      <>
        Ücretsiz kargo için{' '}
        <span className="font-semibold text-mint-darker">
          {remaining.toLocaleString('tr-TR')}₺
        </span>{' '}
        daha ekle!
      </>
    );
  } else {
    message = (
      <>
        <span className="font-semibold text-mint-darker">
          {remaining.toLocaleString('tr-TR')}₺
        </span>{' '}
        daha ekle, ücretsiz kargoya ulaş!
      </>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 transition-colors ${
        unlocked ? 'bg-emerald-50 border border-emerald-200' : 'bg-mint-pale border border-mint-light'
      }`}
    >
      {/* Icon + message */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            unlocked ? 'bg-emerald-100' : 'bg-mint-light'
          }`}
        >
          {unlocked ? (
            <CheckCircle2 size={18} className="text-emerald-600" />
          ) : (
            <Truck size={18} className="text-mint-darker" />
          )}
        </div>
        <p className="text-sm text-gray-700 leading-snug pt-1">{message}</p>
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 bg-white rounded-full overflow-hidden border border-mint-light">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            unlocked
              ? 'bg-emerald-400'
              : 'bg-gradient-to-r from-mint-dark to-mint-darker'
          }`}
          style={{ width: `${barWidth}%` }}
        />
        {/* Truck marker that slides along */}
        {!unlocked && subtotal > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-mint-darker border-2 border-white flex items-center justify-center shadow-sm transition-all duration-700"
            style={{ left: `${barWidth}%` }}
          >
            <Truck size={9} className="text-white" />
          </div>
        )}
      </div>

      {/* Amount labels */}
      {!unlocked && (
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">0₺</span>
          <span className="text-xs text-mint-darker font-medium">1.000₺ 🚚</span>
        </div>
      )}
    </div>
  );
}
