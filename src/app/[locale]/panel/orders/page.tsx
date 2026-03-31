'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ShoppingCart, Package, CheckCircle, Truck,
  ChevronDown, ChevronRight, Tag, MapPin, RefreshCw, Send,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { formatPrice } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: { tr: string; en: string }; color: string; icon: React.ElementType }> = {
  pending:    { label: { tr: 'Siparişiniz Alındı',        en: 'Pending'    }, color: 'bg-yellow-100 text-yellow-700',    icon: Package     },
  paid:       { label: { tr: 'Ödendi',                    en: 'Paid'       }, color: 'bg-blue-100 text-blue-700',       icon: CheckCircle },
  processing: { label: { tr: 'Siparişiniz Hazırlanıyor',  en: 'Processing' }, color: 'bg-purple-100 text-purple-700',   icon: Package     },
  shipped:    { label: { tr: 'Siparişiniz Kargoda',        en: 'Shipped'    }, color: 'bg-indigo-100 text-indigo-700',   icon: Truck       },
  delivered:  { label: { tr: 'Teslim Edildi',              en: 'Delivered'  }, color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled:  { label: { tr: 'İptal Edildi',               en: 'Cancelled'  }, color: 'bg-red-100 text-red-700',         icon: Package     },
};

function TrackingForm({ order, locale }: { order: Order; locale: 'tr' | 'en' }) {
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!trackingNumber.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: trackingNumber.trim(), trackingUrl: trackingUrl.trim() }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
        <Truck size={12} />
        {locale === 'tr' ? 'Kargo Takip' : 'Shipping Tracking'}
      </h3>
      <input
        type="text"
        value={trackingNumber}
        onChange={e => setTrackingNumber(e.target.value)}
        placeholder={locale === 'tr' ? 'Takip numarası' : 'Tracking number'}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-blush/40"
      />
      <input
        type="text"
        value={trackingUrl}
        onChange={e => setTrackingUrl(e.target.value)}
        placeholder={locale === 'tr' ? 'Takip linki (opsiyonel)' : 'Tracking URL (optional)'}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-blush/40"
      />
      <button
        onClick={handleSave}
        disabled={saving || !trackingNumber.trim()}
        className="flex items-center gap-2 text-sm bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send size={13} />
        {saved
          ? (locale === 'tr' ? 'Gönderildi!' : 'Sent!')
          : saving
            ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...')
            : (locale === 'tr' ? 'Kaydet & Müşteriyi Bildir' : 'Save & Notify Customer')}
      </button>
    </div>
  );
}

function OrderDetail({ order, locale }: { order: Order; locale: 'tr' | 'en' }) {
  return (
    <div className="bg-gray-50 border-t border-gray-100 px-5 py-5 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* ── Items ──────────────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {locale === 'tr' ? 'Ürünler' : 'Items'}
        </h3>
        <div className="space-y-2">
          {order.items.map((item, i) => {
            const itemPrice = (item.product.salePrice ?? item.product.price) * item.quantity;
            return (
              <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color.hex }}
                      title={item.color.label[locale]}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {item.product.name[locale]}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.size} · {item.color.label[locale]} · ×{item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-charcoal ml-4 flex-shrink-0">
                  {formatPrice(itemPrice)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Summary + Address ──────────────────────────────────── */}
      <div className="space-y-4">

        {/* Price breakdown */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {locale === 'tr' ? 'Özet' : 'Summary'}
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{locale === 'tr' ? 'Ara Toplam' : 'Subtotal'}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <Truck size={13} />
                {locale === 'tr' ? 'Kargo' : 'Shipping'}
              </span>
              <span>
                {order.shipping === 0
                  ? (locale === 'tr' ? 'Ücretsiz' : 'Free')
                  : formatPrice(order.shipping)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span className="flex items-center gap-1">
                  <Tag size={13} />
                  {order.discountCode === 'WELCOME5'
                    ? (locale === 'tr' ? 'Hoşgeldin İndirimi' : 'Welcome Discount')
                    : (order.discountCode ?? (locale === 'tr' ? 'İndirim' : 'Discount'))}
                </span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-charcoal pt-2 border-t border-gray-100">
              <span>{locale === 'tr' ? 'Toplam' : 'Total'}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <TrackingForm order={order} locale={locale} />

        {/* Shipping address */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1">
            <MapPin size={12} />
            {locale === 'tr' ? 'Teslimat Adresi' : 'Shipping Address'}
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-sm text-gray-600 space-y-0.5">
            <p className="font-medium text-charcoal">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.district && <p>{order.shippingAddress.district}</p>}
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('admin');
  const orders = useAdminStore(s => s.orders);
  const updateOrderStatus = useAdminStore(s => s.updateOrderStatus);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await (useAdminStore as any).persist?.rehydrate?.();
    setTimeout(() => setRefreshing(false), 600);
  };

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id));

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="font-serif text-2xl font-bold text-charcoal">{t('orders')}</h1>
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
      >
        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        {locale === 'tr' ? 'Yenile' : 'Refresh'}
      </button>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <ShoppingCart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            {locale === 'tr' ? 'Henüz sipariş yok' : 'No orders yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="w-8 px-3 py-3" />
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {locale === 'tr' ? 'Sipariş No' : 'Order #'}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  {locale === 'tr' ? 'Müşteri' : 'Customer'}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {locale === 'tr' ? 'Toplam' : 'Total'}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {t('status')}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  {locale === 'tr' ? 'Tarih' : 'Date'}
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {locale === 'tr' ? 'İşlem' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedId === order.id;

                return (
                  <>
                    <tr
                      key={order.id}
                      onClick={() => toggle(order.id)}
                      className="border-t border-gray-50 hover:bg-gray-50/70 transition-colors cursor-pointer select-none"
                    >
                      <td className="px-3 py-4 text-gray-400">
                        {isExpanded
                          ? <ChevronDown size={15} />
                          : <ChevronRight size={15} />}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-medium text-charcoal">{order.id}</span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-charcoal">{formatPrice(order.total)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label[locale]}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-blush/40 cursor-pointer"
                        >
                          {(Object.keys(statusConfig) as OrderStatus[]).map(s => (
                            <option key={s} value={s}>{statusConfig[s].label[locale]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={7} className="p-0">
                          <OrderDetail order={order} locale={locale} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
