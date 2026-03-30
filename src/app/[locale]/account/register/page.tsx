'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle2, Copy, Check, Star } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { WELCOME5_CODE } from '@/lib/products';

function formatTRPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
}
import ShopLayout from '@/components/layout/ShopLayout';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations('account');
  const router = useRouter();
  const { register, currentUser, addPoints } = useUserStore();
  const applyDiscount = useCartStore(state => state.applyDiscount);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentUser) router.replace(`/${locale}/account`);
  }, [currentUser, locale, router]);

  const update = (field: string, value: string) => {
    let formatted = value;
    if (field === 'phone') formatted = formatTRPhone(value);
    else if (field === 'firstName' || field === 'lastName') formatted = value.replace(/[^a-zA-ZğĞüÜşŞıİöÖçÇ\s]/g, '');
    setForm(p => ({ ...p, [field]: formatted }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim())
      e.firstName = 'Ad zorunludur';
    if (!form.lastName.trim())
      e.lastName = 'Soyad zorunludur';
    if (!form.email.trim())
      e.email = 'E-posta adresi zorunludur';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Geçerli bir e-posta adresi girin';
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length === 0)
      e.phone = 'Telefon numarası zorunludur';
    else if (phoneDigits.length < 10 || !phoneDigits.startsWith('5'))
      e.phone = 'Geçerli bir telefon numarası girin (5XX XXX XX XX)';
    if (form.password.length === 0)
      e.password = 'Şifre zorunludur';
    else if (form.password.length < 6)
      e.password = t('errorPasswordTooShort');
    if (!form.confirm)
      e.confirm = 'Şifre tekrarı zorunludur';
    else if (form.password !== form.confirm)
      e.confirm = t('errorPasswordMismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    setLoading(false);
    if (result.success) {
      applyDiscount('WELCOME5', [WELCOME5_CODE]);
      addPoints(500, 'account_creation', 'Hesap oluşturma bonusu');
      setSuccess(true);
    } else {
      if (result.error === 'emailExists') setErrors(p => ({ ...p, email: t('errorEmailExists') }));
      else if (result.error === 'passwordTooShort') setErrors(p => ({ ...p, password: t('errorPasswordTooShort') }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('WELCOME5').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type = 'text',
    placeholder = '',
    icon: React.ReactNode
  ) => (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={key === 'password' || key === 'confirm' ? (showPassword ? 'text' : 'password') : type}
          value={form[key]}
          onChange={e => update(key, e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush ${errors[key] ? 'border-red-300' : 'border-gray-200'}`}
          placeholder={placeholder}
        />
      </div>
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  if (success) {
    return (
      <ShopLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-10 pb-8 text-center" style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} className="text-white" />
                </div>
                <h1 className="text-white font-serif text-2xl font-bold mb-1">
                  {locale === 'tr' ? 'Hoş Geldiniz!' : 'Welcome!'}
                </h1>
                <p className="text-white/80 text-sm">
                  {locale === 'tr' ? 'Hesabınız başarıyla oluşturuldu.' : 'Your account has been created.'}
                </p>
              </div>

              <div className="px-8 py-7 space-y-5">
                {/* WELCOME5 code */}
                <div className="bg-mint-pale border border-mint-light rounded-2xl p-4">
                  <p className="text-xs font-semibold text-mint-darker uppercase tracking-widest mb-3">
                    {locale === 'tr' ? 'İlk Sipariş İndirim Kodunuz' : 'Your First Order Discount Code'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white border-2 border-mint-dark rounded-xl px-4 py-3 font-mono font-bold text-xl text-mint-darker tracking-widest text-center select-all">
                      WELCOME5
                    </div>
                    <button
                      onClick={handleCopy}
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0"
                      style={{ background: copied ? '#3D7D76' : '#EAF6F4', border: '1px solid #9ECFC5' }}
                      title={locale === 'tr' ? 'Kopyala' : 'Copy'}
                    >
                      {copied
                        ? <Check size={18} className="text-white" />
                        : <Copy size={18} className="text-mint-darker" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {locale === 'tr' ? 'İlk siparişinizde %5 indirim kazanın.' : '5% off your first order.'}
                  </p>
                </div>

                {/* 500 points */}
                <div className="flex items-center gap-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Star size={24} className="text-yellow-500 fill-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">
                      {locale === 'tr' ? '500 Puan Hesabınıza Eklendi!' : '500 Bonus Points Added!'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {locale === 'tr'
                        ? 'Alışveriş yaptıkça daha fazla puan kazanın.'
                        : 'Earn more points with every purchase.'}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-2.5 pt-1">
                  <Link
                    href={`/${locale}/products`}
                    className="flex items-center justify-center w-full px-6 py-3.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
                  >
                    {locale === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
                  </Link>
                  <Link
                    href={`/${locale}/account`}
                    className="flex items-center justify-center w-full px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {locale === 'tr' ? 'Hesabıma Git' : 'Go to My Account'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-rose-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-rose-deep" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal">{t('registerTitle')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('registerSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {field(t('firstName'), 'firstName', 'text', locale === 'tr' ? 'Ad' : 'First', <User size={15} />)}
                {field(t('lastName'), 'lastName', 'text', locale === 'tr' ? 'Soyad' : 'Last', <User size={15} />)}
              </div>
              {field(t('email'), 'email', 'email', 'ornek@email.com', <Mail size={15} />)}
              {field(t('phone'), 'phone', 'tel', '5XX XXX XX XX', <Phone size={15} />)}

              {/* Password with toggle */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t('password')}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush ${errors.confirm ? 'border-red-300' : 'border-gray-200'}`}
                    placeholder="••••••"
                  />
                </div>
                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-3 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? '...' : t('register')}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {t('hasAccount')}{' '}
              <Link href={`/${locale}/account/login`} className="text-rose-deep font-medium hover:underline">
                {t('login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
