'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import ShopLayout from '@/components/layout/ShopLayout';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('account');
  const router = useRouter();
  const { login, currentUser } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in → go to account
  useEffect(() => {
    if (currentUser) router.replace(`/${locale}/account`);
  }, [currentUser, locale, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success(t('loginSuccess'));
      router.push(`/${locale}/account`);
    } else {
      const msg = result.error === 'notFound' ? t('errorNotFound') : t('errorInvalidPassword');
      setError(msg);
    }
  };

  return (
    <ShopLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-rose-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-rose-deep" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal">{t('loginTitle')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t('email')}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">{t('password')}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
                    placeholder="••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end -mt-1">
                <Link href={`/${locale}/account/forgot-password`} className="text-xs text-rose-deep hover:underline">
                  {locale === 'tr' ? 'Şifremi unuttum' : 'Forgot password?'}
                </Link>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-white py-3 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? '...' : t('login')}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {t('noAccount')}{' '}
              <Link href={`/${locale}/account/register`} className="text-rose-deep font-medium hover:underline">
                {t('register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
