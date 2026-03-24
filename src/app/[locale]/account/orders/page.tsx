'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Package, ChevronDown, ChevronRight, Truck, Tag,
  MapPin, ShoppingBag, ArrowLeft,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAdminStore } from '@/store/adminStore';
import { formatPrice } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import ShopLayout from '@/components/layout/ShopLayout';

const statusConfig: Record<OrderStatus, { label: { tr: string; en: string }; color: string }> = {
  pending:    { label: { tr: 'Siparişiniz Alındı',        en: 'Pending'    }, color: 'bg-yellow-100 text-yellow-700'   },
  paid:       { label: { tr: 'Ödendi',                    en: 'Paid'       }, color: 'bg-blue-100 text-blue-700'      },
  processing: { label: { tr: 'Siparişiniz Hazırlanıyor',  en: 'Processing' }, color: 'bg-purple-100 text-purple-700'  },
  shipped:    { label: { tr: 'Siparişiniz Kargoda',        en: 'Shipped'    }, color: 'bg-indigo-100 text-indigo-700'  },
  delivered:  { label: { tr: 'Teslim Edildi',              en: 'Delivered'  }, color: 'bg-emerald-100 text-emerald-700'},
  cancelled:  { label: { tr: 'İptal Edildi',               en: 'Cancelled'  }, color: 'bg-red-100 text-red-700'        },
};

const statusSteps: OrderStatus[] = ['paid', 'processing', 'shipped', 'delivered'];

function StatusTracker({ status, locale }: { status: OrderStatus; locale: 'tr' | 'en' }) {
  if (status === 'pending' || status === 'cancelled') return null;
  const currentIdx = statusSteps.indexOf(status);
  return (
    <div className="flex items-center gap-0 mb-4">
      {statusSteps.map((step, idx) => {
        const done = idx <= currentIdx;
        const cfg = statusConfig[step];
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-mint-darker text-white' : 'bg-gray-100 text-gray-400'}`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] mt-1 whitespace-nowrap font-medium ${done ? 'text-mint-darker' : 'text-gray-400'}`}>
                {cfg.label[locale]}
              </span>
            </div>
            {idx < statusSteps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${idx < currentIdx ? 'bg-mint-darker' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, locale }: { order: Order; locale: 'tr' | 'en' }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-mint-pale flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-mint-darker" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold text-charcoal">{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label[locale]}
          </span>
          <span className="font-semibold text-charcoal text-sm">{formatPrice(order.total)}</span>
          {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">

          {/* Status tracker */}
          <StatusTracker status={order.status} locale={locale} />

          {/* Mobile status badge */}
          <span className={`sm:hidden inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label[locale]}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {locale === 'tr' ? 'Ürünler' : 'Items'}
              </p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: item.color.hex }} />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-charcoal truncate">{item.product.name[locale]}</p>
                        <p className="text-[11px] text-gray-400">{item.size} · {item.color.label[locale]} · ×{item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-charcoal flex-shrink-0">
                      {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary + Address */}
            <div className="space-y-3">
              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>{locale === 'tr' ? 'Ara Toplam' : 'Subtotal'}</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="flex items-center gap-1"><Truck size={11} />{locale === 'tr' ? 'Kargo' : 'Shipping'}</span>
                  <span>{order.shipping === 0 ? (locale === 'tr' ? 'Ücretsiz' : 'Free') : formatPrice(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1"><Tag size={11} />{order.discountCode ?? (locale === 'tr' ? 'İndirim' : 'Discount')}</span>
                    <span>−{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-charcoal pt-1.5 border-t border-gray-200">
                  <span>{locale === 'tr' ? 'Toplam' : 'Total'}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-0.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                  <MapPin size={10} />{locale === 'tr' ? 'Teslimat Adresi' : 'Shipping Address'}
                </p>
                <p className="font-medium text-charcoal">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.district && <p>{order.shippingAddress.district}</p>}
                <p>{order.shippingAddress.city}{order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountOrdersPage() {
  const locale = useLocale() as 'tr' | 'en';
  const router = useRouter();
  const currentUser = useUserStore(s => s.currentUser);
  const allOrders = useAdminStore(s => s.orders);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !currentUser) router.replace(`/${locale}/account/login`);
  }, [mounted, currentUser, locale, router]);

  if (!mounted || !currentUser) return null;

  const orders = allOrders.filter(
    o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back link */}
        <Link
          href={`/${locale}/account`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-charcoal transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          {locale === 'tr' ? 'Hesabıma Dön' : 'Back to Account'}
        </Link>

        <h1 className="font-serif text-2xl text-charcoal mb-6">
          {locale === 'tr' ? 'Siparişlerim' : 'My Orders'}
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <ShoppingBag size={44} className="text-gray-200 mx-auto mb-4" />
            <p className="text-charcoal font-medium mb-1">
              {locale === 'tr' ? 'Henüz siparişiniz yok' : 'No orders yet'}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {locale === 'tr' ? 'İlk alışverişinizi yapmaya hazır mısınız?' : 'Ready to place your first order?'}
            </p>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-mint-darker text-white text-sm font-medium rounded-full hover:bg-mint-dark transition-colors"
            >
              <ShoppingBag size={15} />
              {locale === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-2">
              {orders.length} {locale === 'tr' ? 'sipariş' : orders.length === 1 ? 'order' : 'orders'}
            </p>
            {orders.map(order => (
              <OrderCard key={order.id} order={order} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
