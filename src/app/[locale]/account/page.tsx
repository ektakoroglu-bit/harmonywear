'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Package, MapPin, Settings, LogOut, ChevronDown, ChevronRight,
  Plus, Trash2, Tag, Truck, User, Star, Gift, TrendingUp,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { LOYALTY_REWARDS } from '@/lib/products';
import { DiscountCode } from '@/types';

function formatTRPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}
import { useAdminStore } from '@/store/adminStore';
import { formatPrice } from '@/lib/utils';
import { CITY_NAMES, getDistricts } from '@/lib/turkey-cities';
import { Order, OrderStatus, SavedAddress } from '@/types';
import ShopLayout from '@/components/layout/ShopLayout';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';

// ── Status config (same as admin orders page) ────────────────────────────────
const statusConfig: Record<OrderStatus, { label: { tr: string; en: string }; color: string }> = {
  pending:    { label: { tr: 'Bekliyor',      en: 'Pending'    }, color: 'bg-yellow-100 text-yellow-700'  },
  paid:       { label: { tr: 'Ödendi',        en: 'Paid'       }, color: 'bg-blue-100 text-blue-700'     },
  processing: { label: { tr: 'Hazırlanıyor',  en: 'Processing' }, color: 'bg-purple-100 text-purple-700' },
  shipped:    { label: { tr: 'Kargoda',       en: 'Shipped'    }, color: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: { tr: 'Teslim Edildi', en: 'Delivered'  }, color: 'bg-emerald-100 text-emerald-700'},
  cancelled:  { label: { tr: 'İptal',         en: 'Cancelled'  }, color: 'bg-red-100 text-red-700'       },
};

// ── Order detail expand panel ─────────────────────────────────────────────────
function OrderDetail({ order, locale }: { order: Order; locale: 'tr' | 'en' }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      {/* Items */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {locale === 'tr' ? 'Ürünler' : 'Items'}
        </p>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: item.color.hex }} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-charcoal truncate">{item.product.name[locale]}</p>
                  <p className="text-xs text-gray-400">{item.size} · {item.color.label[locale]} · ×{item.quantity}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-charcoal flex-shrink-0">
                {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + address */}
      <div className="space-y-3">
        {/* Price breakdown */}
        <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-1.5">
          <div className="flex justify-between text-gray-500 text-xs">
            <span>{locale === 'tr' ? 'Ara Toplam' : 'Subtotal'}</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span className="flex items-center gap-1"><Truck size={11} />{locale === 'tr' ? 'Kargo' : 'Shipping'}</span>
            <span>{order.shipping === 0 ? (locale === 'tr' ? 'Ücretsiz' : 'Free') : formatPrice(order.shipping)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 text-xs">
              <span className="flex items-center gap-1"><Tag size={11} />{order.discountCode ?? (locale === 'tr' ? 'İndirim' : 'Discount')}</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-charcoal text-xs pt-1.5 border-t border-gray-100">
            <span>{locale === 'tr' ? 'Toplam' : 'Total'}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            <MapPin size={10} />{locale === 'tr' ? 'Teslimat Adresi' : 'Shipping Address'}
          </p>
          <p className="text-xs font-medium text-charcoal">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-xs text-gray-500">{order.shippingAddress.address}</p>
          {order.shippingAddress.district && <p className="text-xs text-gray-500">{order.shippingAddress.district}</p>}
          <p className="text-xs text-gray-500">{order.shippingAddress.city}{order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}</p>
          <p className="text-xs text-gray-500">{order.shippingAddress.country}</p>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Orders ───────────────────────────────────────────────────────────────
function OrdersTab({ locale, t }: { locale: 'tr' | 'en'; t: ReturnType<typeof useTranslations> }) {
  const { currentUser } = useUserStore();
  const allOrders = useAdminStore(s => s.orders);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const myOrders = allOrders.filter(
    o => o.customer.email.toLowerCase() === (currentUser?.email ?? '')
  );

  if (myOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package size={48} className="text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 mb-6">{t('noOrders')}</p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 bg-charcoal text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-charcoal-light transition-colors"
        >
          {t('shopNow')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {myOrders.map(order => {
        const status = statusConfig[order.status];
        const isExpanded = expandedId === order.id;
        const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
        return (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedId(prev => prev === order.id ? null : order.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                {isExpanded ? <ChevronDown size={15} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={15} className="text-gray-400 flex-shrink-0" />}
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-charcoal">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                    {' · '}
                    {itemCount} {locale === 'tr' ? 'ürün' : 'item' + (itemCount !== 1 ? 's' : '')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label[locale]}
                </span>
                <span className="font-semibold text-sm text-charcoal">{formatPrice(order.total)}</span>
              </div>
            </button>
            {isExpanded && (
              <div className="px-5 pb-5">
                <OrderDetail order={order} locale={locale} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Addresses ────────────────────────────────────────────────────────────
const emptyAddrForm = { label: '', firstName: '', lastName: '', address: '', city: '', district: '', zipCode: '', country: 'Türkiye' };

function AddressesTab({ locale, t }: { locale: 'tr' | 'en'; t: ReturnType<typeof useTranslations> }) {
  const { currentUser, addAddress, removeAddress } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddrForm);

  const upd = (k: string, v: string) => setForm(p => ({
    ...p,
    [k]: v,
    ...(k === 'city' ? { district: '' } : {}),
  }));

  const districts = getDistricts(form.city);

  const handleSave = () => {
    if (!form.label || !form.firstName || !form.address || !form.city) return;
    addAddress(form);
    toast.success(t('addressSaved'));
    setForm(emptyAddrForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    removeAddress(id);
    toast.success(t('addressDeleted'));
  };

  const addresses: SavedAddress[] = currentUser?.addresses ?? [];

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm py-8 text-center">{t('noAddresses')}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-rose-deep bg-rose-pale px-2 py-0.5 rounded-full">{addr.label}</span>
              <button onClick={() => handleDelete(addr.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <p className="text-sm font-medium text-charcoal">{addr.firstName} {addr.lastName}</p>
            <p className="text-xs text-gray-500 mt-1">{addr.address}</p>
            {addr.district && <p className="text-xs text-gray-500">{addr.district}</p>}
            <p className="text-xs text-gray-500">{addr.city}{addr.zipCode && ` ${addr.zipCode}`}</p>
            <p className="text-xs text-gray-500">{addr.country}</p>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="font-medium text-charcoal text-sm">{t('addAddress')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Address label — full width */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('addressLabel')}</label>
              <input value={form.label} onChange={e => upd('label', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush" />
            </div>
            {/* First / last name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('firstName')}</label>
              <input value={form.firstName} onChange={e => upd('firstName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('lastName')}</label>
              <input value={form.lastName} onChange={e => upd('lastName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush" />
            </div>
            {/* Street address — full width */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('address')}</label>
              <input value={form.address} onChange={e => upd('address', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush" />
            </div>
            {/* City dropdown */}
            <Select
              label={locale === 'tr' ? 'İl' : 'Province'}
              placeholder={locale === 'tr' ? 'İl seçiniz' : 'Select province'}
              options={CITY_NAMES}
              value={form.city}
              onChange={e => upd('city', e.target.value)}
            />
            {/* District dropdown */}
            <Select
              label={locale === 'tr' ? 'İlçe' : 'District'}
              placeholder={
                !form.city
                  ? (locale === 'tr' ? 'Önce il seçiniz' : 'Select province first')
                  : (locale === 'tr' ? 'İlçe seçiniz' : 'Select district')
              }
              options={districts}
              value={form.district}
              onChange={e => upd('district', e.target.value)}
              disabled={!form.city}
            />
            {/* ZIP */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('zipCode')}</label>
              <input value={form.zipCode} onChange={e => upd('zipCode', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush" />
            </div>
            {/* Country */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t('country')}</label>
              <input value="Türkiye" readOnly
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-default" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => { setShowForm(false); setForm(emptyAddrForm); }} className="text-sm text-gray-500 hover:text-charcoal px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              {t('cancel')}
            </button>
            <button onClick={handleSave} className="bg-charcoal text-white text-sm px-5 py-2 rounded-lg hover:bg-charcoal-light transition-colors font-medium">
              {t('save')}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-rose-deep border border-dashed border-rose-blush rounded-2xl px-5 py-3 hover:bg-rose-pale transition-colors w-full justify-center"
        >
          <Plus size={15} /> {t('addAddress')}
        </button>
      )}
    </div>
  );
}

// ── Tab: Settings ─────────────────────────────────────────────────────────────
function SettingsTab({ locale, t }: { locale: 'tr' | 'en'; t: ReturnType<typeof useTranslations> }) {
  const { currentUser, updateProfile, changePassword } = useUserStore();

  const [profile, setProfile] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    phone: currentUser?.phone ?? '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSave = async () => {
    setProfileLoading(true);
    await new Promise(r => setTimeout(r, 300));
    updateProfile(profile);
    setProfileLoading(false);
    toast.success(t('profileUpdated'));
  };

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      toast.error(t('errorPasswordMismatch'));
      return;
    }
    setPwdLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const result = changePassword(passwords.current, passwords.next);
    setPwdLoading(false);
    if (result.success) {
      toast.success(t('passwordChanged'));
      setPasswords({ current: '', next: '', confirm: '' });
    } else {
      const msg = result.error === 'invalidPassword' ? t('errorInvalidPassword') : t('errorPasswordTooShort');
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-charcoal">{locale === 'tr' ? 'Profil Bilgileri' : 'Profile Information'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([['firstName', t('firstName')], ['lastName', t('lastName')], ['phone', t('phone')]] as [string, string][]).map(([key, label]) => (
            <div key={key} className={key === 'phone' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
              <input
                value={(profile as Record<string, string>)[key]}
                onChange={e => {
                  const val = key === 'phone' ? formatTRPhone(e.target.value) : e.target.value;
                  setProfile(p => ({ ...p, [key]: val }));
                }}
                placeholder={key === 'phone' ? '5XX XXX XX XX' : undefined}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
              />
            </div>
          ))}
        </div>
        <div className="pt-1">
          <p className="text-xs text-gray-400 mb-3">{locale === 'tr' ? 'E-posta' : 'Email'}: <span className="text-charcoal">{currentUser?.email}</span></p>
          <button
            onClick={handleProfileSave}
            disabled={profileLoading}
            className="bg-charcoal text-white text-sm px-6 py-2.5 rounded-lg hover:bg-charcoal-light transition-colors font-medium disabled:opacity-60"
          >
            {profileLoading ? '...' : t('saveChanges')}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-charcoal">{t('changePassword')}</h3>
        {([['current', t('currentPassword')], ['next', t('newPassword')], ['confirm', t('confirmPassword')]] as [keyof typeof passwords, string][]).map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input
              type="password"
              value={passwords[key]}
              onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
              placeholder="••••••"
            />
          </div>
        ))}
        <button
          onClick={handlePasswordChange}
          disabled={pwdLoading}
          className="bg-charcoal text-white text-sm px-6 py-2.5 rounded-lg hover:bg-charcoal-light transition-colors font-medium disabled:opacity-60"
        >
          {pwdLoading ? '...' : t('changePassword')}
        </button>
      </div>
    </div>
  );
}

// ── Tab: Points ──────────────────────────────────────────────────────────────
function PointsTab({ locale }: { locale: 'tr' | 'en' }) {
  const { currentUser, redeemReward } = useUserStore();
  const addDiscountCode = useAdminStore(s => s.addDiscountCode);
  const applyDiscount = useCartStore(s => s.applyDiscount);
  const tr = locale === 'tr';

  const points = currentUser?.points ?? 0;
  const history = currentUser?.pointsHistory ?? [];

  const nextReward = LOYALTY_REWARDS.find(r => r.points > points);
  const progressPct = nextReward ? Math.min(100, (points / nextReward.points) * 100) : 100;

  const handleRedeem = (requiredPoints: number, discountValue: number) => {
    const result = redeemReward(requiredPoints, discountValue);
    if (!result.success || !result.code) {
      toast.error(tr ? 'Yeterli puanınız yok.' : 'Not enough points.');
      return;
    }
    const newCode: Omit<DiscountCode, 'id' | 'usedCount'> = {
      code: result.code,
      type: 'fixed',
      value: discountValue,
      maxUses: 1,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      isActive: true,
    };
    addDiscountCode(newCode);
    applyDiscount(result.code, [{ ...newCode, id: result.code, usedCount: 0 }]);
    toast.success(tr ? `${discountValue}₺ indirim kodu sepetinize eklendi!` : `${discountValue}₺ reward applied to your cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Star size={20} className="text-yellow-300 fill-yellow-300" />
          <span className="text-white/80 text-sm font-medium">{tr ? 'Puan Bakiyeniz' : 'Your Points Balance'}</span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-bold">{points.toLocaleString('tr-TR')}</span>
          <span className="text-white/70 text-lg mb-1">{tr ? 'puan' : 'pts'}</span>
        </div>
        {nextReward ? (
          <>
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>{tr ? 'Sonraki ödül' : 'Next reward'}: {nextReward.label[tr ? 'tr' : 'en']}</span>
              <span>{(nextReward.points - points).toLocaleString('tr-TR')} {tr ? 'puan kaldı' : 'pts away'}</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>{points.toLocaleString('tr-TR')}</span>
              <span>{nextReward.points.toLocaleString('tr-TR')}</span>
            </div>
          </>
        ) : (
          <p className="text-yellow-300 font-semibold">{tr ? 'Tüm ödüllere ulaştınız! 🎉' : 'You unlocked all rewards! 🎉'}</p>
        )}
      </div>

      {/* Rewards */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-charcoal flex items-center gap-2 mb-4">
          <Gift size={18} className="text-mint-darker" />
          {tr ? 'Kullanılabilir Ödüller' : 'Available Rewards'}
        </h3>
        <div className="space-y-3">
          {LOYALTY_REWARDS.map(reward => {
            const unlocked = points >= reward.points;
            return (
              <div
                key={reward.points}
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  unlocked ? 'bg-mint-pale border-mint-light' : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${unlocked ? 'bg-mint-light' : 'bg-gray-200'}`}>
                  {unlocked ? '🎁' : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${unlocked ? 'text-charcoal' : 'text-gray-400'}`}>
                    {reward.label[tr ? 'tr' : 'en']}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {reward.points.toLocaleString('tr-TR')} {tr ? 'puan gerekli' : 'points required'}
                    {!unlocked && <span className="text-mint-darker"> · {(reward.points - points).toLocaleString('tr-TR')} {tr ? 'puan kaldı' : 'pts away'}</span>}
                  </p>
                </div>
                {unlocked ? (
                  <button
                    onClick={() => handleRedeem(reward.points, reward.discount)}
                    className="shrink-0 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
                  >
                    {tr ? 'Kullan' : 'Redeem'}
                  </button>
                ) : (
                  <div className="shrink-0 text-right">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                      <div
                        className="bg-mint-dark h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (points / reward.points) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-charcoal flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-mint-darker" />
          {tr ? 'Puan Nasıl Kazanılır?' : 'How to Earn Points'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: '👤', title: tr ? 'Hesap Aç' : 'Create Account',    pts: 250, desc: tr ? 'Bir kerelik' : 'One-time' },
            { emoji: '🔔', title: tr ? 'Bildirimlere İzin Ver' : 'Allow Notifications', pts: 250, desc: tr ? 'Bir kerelik' : 'One-time' },
            { emoji: '🛍️', title: tr ? 'Alışveriş Yap' : 'Make a Purchase', pts: 50,  desc: tr ? 'Her 100₺ için' : 'Per 100₺ spent' },
          ].map(item => (
            <div key={item.title} className="bg-mint-pale rounded-xl p-3 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-xs font-semibold text-charcoal">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              <p className="text-mint-darker font-bold text-sm mt-1">+{item.pts} {tr ? 'puan' : 'pts'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-charcoal mb-4">{tr ? 'Puan Geçmişi' : 'Points History'}</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">{tr ? 'Henüz puan işlemi yok.' : 'No points activity yet.'}</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.type === 'earned' ? 'bg-mint-pale' : 'bg-rose-pale'
                  }`}>
                    {tx.type === 'earned' ? '⬆️' : '⬇️'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{tx.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-mint-darker' : 'text-rose-deep'}`}>
                  {tx.type === 'earned' ? '+' : '−'}{tx.amount.toLocaleString('tr-TR')} {tr ? 'puan' : 'pts'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
type Tab = 'orders' | 'addresses' | 'points' | 'settings';

export default function AccountPage() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('account');
  const router = useRouter();
  const { currentUser, logout } = useUserStore();
  const [tab, setTab] = useState<Tab>('orders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !currentUser) router.replace(`/${locale}/account/login`);
  }, [mounted, currentUser, locale, router]);

  if (!mounted || !currentUser) return null;

  const handleLogout = () => {
    logout();
    toast.success(locale === 'tr' ? 'Çıkış yapıldı.' : 'Signed out.');
    router.push(`/${locale}`);
  };

  const userPoints = currentUser.points ?? 0;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'orders',    label: t('myOrders'),    icon: <Package size={16} /> },
    { key: 'addresses', label: t('myAddresses'), icon: <MapPin size={16} /> },
    { key: 'points',    label: locale === 'tr' ? 'Puanlarım' : 'My Points', icon: <Star size={16} /> },
    { key: 'settings',  label: t('settings'),    icon: <Settings size={16} /> },
  ];

  return (
    <ShopLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Account header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-pale rounded-full flex items-center justify-center">
              <User size={22} className="text-rose-deep" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t('welcomeBack')}</p>
              <h1 className="font-serif text-xl font-bold text-charcoal">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              {userPoints > 0 && (
                <button
                  onClick={() => setTab('points')}
                  className="flex items-center gap-1 mt-0.5 text-xs text-mint-darker hover:underline"
                >
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  {userPoints.toLocaleString('tr-TR')} {locale === 'tr' ? 'puan' : 'pts'}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 mb-6 gap-1 overflow-x-auto">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                tab === key
                  ? 'border-mint-darker text-mint-darker'
                  : 'border-transparent text-gray-500 hover:text-charcoal hover:border-gray-300'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
              {key === 'points' && userPoints > 0 && (
                <span className="ml-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
                  {userPoints.toLocaleString('tr-TR')}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'orders'    && <OrdersTab    locale={locale} t={t} />}
        {tab === 'addresses' && <AddressesTab locale={locale} t={t} />}
        {tab === 'points'    && <PointsTab    locale={locale} />}
        {tab === 'settings'  && <SettingsTab  locale={locale} t={t} />}
      </div>
    </ShopLayout>
  );
}
