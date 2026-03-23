'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CreditCard, User, MapPin, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';
import { Order } from '@/types';
import { formatPrice, generateOrderId, formatCardNumber, formatExpiry } from '@/lib/utils';

function formatTRPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}
import { CITY_NAMES, getDistricts } from '@/lib/turkey-cities';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  zipCode: string;
  country: string;
  sameAddress: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingDistrict: string;
  billingZipCode: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

const defaultForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  zipCode: '',
  country: 'Türkiye',
  sameAddress: true,
  billingFirstName: '',
  billingLastName: '',
  billingAddress: '',
  billingCity: '',
  billingDistrict: '',
  billingZipCode: '',
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: '',
};

export default function CheckoutForm() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('checkout');
  const { items, getSubtotal, getShipping, getTotal, getDiscountAmount, discountCode, clearCart } = useCartStore();
  const discountAmount = getDiscountAmount();
  const addPoints = useUserStore(state => state.addPoints);
  const currentUser = useUserStore(state => state.currentUser);
  const addOrder = useAdminStore(state => state.addOrder);
  const savedAddresses = currentUser?.addresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (field: keyof FormData, value: string | boolean) => {
    const formatted = field === 'phone' && typeof value === 'string' ? formatTRPhone(value) : value;
    setForm(prev => ({
      ...prev,
      [field]: formatted,
      // Reset district when city changes
      ...(field === 'city' ? { district: '' } : {}),
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const shippingDistricts = getDistricts(form.city);

  const applySavedAddress = (id: string) => {
    const addr = savedAddresses.find(a => a.id === id);
    if (!addr) return;
    setSelectedAddressId(id);
    setForm(prev => ({
      ...prev,
      address: addr.address,
      city: addr.city,
      district: addr.district ?? '',
      zipCode: addr.zipCode ?? '',
      country: addr.country || 'Türkiye',
    }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    const req = t('required') || 'Required';
    if (!form.firstName) e.firstName = req;
    if (!form.lastName) e.lastName = req;
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Geçerli e-posta girin';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = locale === 'tr' ? 'Geçerli telefon numarası girin' : 'Enter a valid phone number';
    if (!form.address) e.address = req;
    if (!form.city) e.city = req;
    if (!form.cardNumber || form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Geçerli kart numarası girin';
    if (!form.cardName) e.cardName = req;
    if (!form.expiry || form.expiry.length < 5) e.expiry = req;
    else if (parseInt(form.expiry.substring(0, 2), 10) < 1 || parseInt(form.expiry.substring(0, 2), 10) > 12) e.expiry = 'Geçersiz ay';
    if (!form.cvv || form.cvv.length < 3) e.cvv = req;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const orderId = generateOrderId();
      const [expMonth, expYear] = form.expiry.split('/');

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          total: getTotal(),
          buyer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
          },
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            district: form.district,
            country: form.country,
            zipCode: form.zipCode,
          },
          billingAddress: form.sameAddress ? {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            country: form.country,
            zipCode: form.zipCode,
          } : {
            firstName: form.billingFirstName,
            lastName: form.billingLastName,
            address: form.billingAddress,
            city: form.billingCity,
            country: form.country,
            zipCode: form.billingZipCode,
          },
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name[locale as 'tr' | 'en'],
            price: (item.product.salePrice ?? item.product.price) * item.quantity,
          })),
          card: {
            cardHolderName: form.cardName,
            cardNumber: form.cardNumber.replace(/\s/g, ''),
            expireMonth: expMonth?.trim(),
            expireYear: `20${expYear?.trim()}`,
            cvc: form.cvv,
          },
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const order: Order = {
          id: orderId,
          items: items.map(i => ({ ...i })),
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            district: form.district,
            zipCode: form.zipCode,
            country: form.country,
          },
          billingAddress: form.sameAddress ? {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            district: form.district,
            zipCode: form.zipCode,
            country: form.country,
          } : {
            firstName: form.billingFirstName,
            lastName: form.billingLastName,
            address: form.billingAddress,
            city: form.billingCity,
            district: form.billingDistrict,
            zipCode: form.billingZipCode,
            country: form.country,
          },
          subtotal: getSubtotal(),
          shipping: getShipping(),
          discount: discountAmount,
          total: getTotal(),
          discountCode: discountCode ?? undefined,
          status: 'paid',
          paymentId: data.paymentId,
          createdAt: new Date().toISOString(),
        };
        addOrder(order);
        const earnedPoints = Math.floor(getSubtotal() / 100) * 50;
        if (earnedPoints > 0) addPoints(earnedPoints, 'purchase', `${orderId} numaralı sipariş`, orderId);
        clearCart();

        // Send confirmation emails (fire-and-forget — don't block on email errors)
        fetch('/api/email/order-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        }).catch(err => console.error('[EMAIL] Failed to send order emails:', err));

        router.push(`/${locale}/checkout/success?order=${orderId}`);
      } else {
        toast.error(data.errorMessage || 'Ödeme başarısız');
      }
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Info */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="flex items-center gap-2 font-semibold text-charcoal mb-5">
          <User size={18} className="text-rose-deep" />
          {t('personalInfo')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label={t('firstName')} value={form.firstName} onChange={e => update('firstName', e.target.value)} error={errors.firstName} required />
          <Input label={t('lastName')} value={form.lastName} onChange={e => update('lastName', e.target.value)} error={errors.lastName} required />
          <Input label={t('email')} type="email" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} required />
          <Input label={t('phone')} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} error={errors.phone} required placeholder="5XX XXX XX XX" />
        </div>
      </section>

      {/* Shipping Address */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="flex items-center gap-2 font-semibold text-charcoal mb-5">
          <MapPin size={18} className="text-rose-deep" />
          {t('shippingAddress')}
        </h2>

        {/* Saved address picker */}
        {savedAddresses.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {locale === 'tr' ? 'Kayıtlı Adreslerim' : 'Saved Addresses'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {savedAddresses.map(addr => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => applySavedAddress(addr.id)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    selectedAddressId === addr.id
                      ? 'border-mint-darker bg-mint-pale text-charcoal'
                      : 'border-gray-200 hover:border-mint-dark hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <p className="font-semibold text-charcoal text-xs mb-0.5">{addr.label}</p>
                  <p className="text-xs text-gray-500 truncate">{addr.address}</p>
                  <p className="text-xs text-gray-400">{addr.district ? `${addr.district}, ` : ''}{addr.city}</p>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{locale === 'tr' ? 'ya da yeni adres girin' : 'or enter a new address'}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label={t('address')} value={form.address} onChange={e => update('address', e.target.value)} error={errors.address} required />
          </div>
          <Select
            label={locale === 'tr' ? 'İl' : 'Province'}
            placeholder={locale === 'tr' ? 'İl seçiniz' : 'Select province'}
            options={CITY_NAMES}
            value={form.city}
            onChange={e => update('city', e.target.value)}
            error={errors.city}
            required
          />
          <Select
            label={locale === 'tr' ? 'İlçe' : 'District'}
            placeholder={
              !form.city
                ? (locale === 'tr' ? 'Önce il seçiniz' : 'Select province first')
                : (locale === 'tr' ? 'İlçe seçiniz' : 'Select district')
            }
            options={shippingDistricts}
            value={form.district}
            onChange={e => update('district', e.target.value)}
            error={errors.district}
            disabled={!form.city}
          />
          <Input label={t('zipCode')} value={form.zipCode} onChange={e => update('zipCode', e.target.value)} />
          <Input label={t('country')} value="Türkiye" readOnly className="bg-gray-50 cursor-default text-gray-500" />
        </div>
      </section>

      {/* Payment */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="flex items-center gap-2 font-semibold text-charcoal mb-5">
          <CreditCard size={18} className="text-rose-deep" />
          {t('payment')}
        </h2>
        <div className="flex items-center gap-2 mb-5 p-3 bg-emerald-50 rounded-xl">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium">{t('securePayment')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label={t('cardNumber')}
              value={form.cardNumber}
              onChange={e => update('cardNumber', formatCardNumber(e.target.value))}
              error={errors.cardNumber}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label={t('cardName')}
              value={form.cardName}
              onChange={e => update('cardName', e.target.value.toUpperCase())}
              error={errors.cardName}
              placeholder="AD SOYAD"
              required
            />
          </div>
          <Input
            label={t('expiry')}
            value={form.expiry}
            onChange={e => update('expiry', formatExpiry(e.target.value))}
            error={errors.expiry}
            placeholder="AA/YY"
            maxLength={5}
            required
          />
          <Input
            label={t('cvv')}
            value={form.cvv}
            onChange={e => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            error={errors.cvv}
            placeholder="123"
            maxLength={4}
            type="password"
            required
          />
        </div>
      </section>

      {/* Order Summary inline */}
      <div className="bg-cream rounded-2xl p-5 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t('orderSummary')}</span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-700">
            <span className="truncate mr-2">{item.product.name[locale as 'tr' | 'en']} ({item.size}) ×{item.quantity}</span>
            <span className="shrink-0">{formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}</span>
          </div>
        ))}
        <hr className="border-gray-200" />
        <div className="flex justify-between text-gray-600">
          <span>{locale === 'tr' ? 'Kargo' : 'Shipping'}</span>
          <span>{getShipping() === 0 ? (locale === 'tr' ? 'Ücretsiz' : 'Free') : formatPrice(getShipping())}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>{discountCode}</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-charcoal text-base pt-1">
          <span>{t('total') || 'Toplam'}</span>
          <span>{formatPrice(getTotal())}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center px-4">{t('terms')}</p>

      <Button type="submit" size="xl" fullWidth loading={loading} className="rounded-xl">
        {loading ? t('processing') : t('placeOrder')} — {formatPrice(getTotal())}
      </Button>
    </form>
  );
}
