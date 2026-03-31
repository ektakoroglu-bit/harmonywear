'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Lock, Eye, EyeOff } from 'lucide-react';
import ShopLayout from '@/components/layout/ShopLayout';

function ResetPasswordForm() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError(locale === 'tr' ? 'Şifre en az 8 karakter olmalıdır.' : 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError(locale === 'tr' ? 'Şifreler eşleşmiyor.' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.error === 'invalidOrExpiredToken'
          ? (locale === 'tr' ? 'Bu bağlantı geçersiz veya süresi dolmuş.' : 'This link is invalid or has expired.')
          : (locale === 'tr' ? 'Bir hata oluştu.' : 'Something went wrong.');
        setError(msg);
        return;
      }
      setDone(true);
      setTimeout(() => router.push(`/${locale}/account/login`), 3000);
    } catch {
      setError(locale === 'tr' ? 'Bir hata oluştu.' : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-500 text-sm">
          {locale === 'tr' ? 'Geçersiz bağlantı.' : 'Invalid link.'}
        </p>
        <Link href={`/${locale}/account/forgot-password`} className="text-rose-deep text-sm font-medium hover:underline">
          {locale === 'tr' ? 'Yeni bağlantı talep et' : 'Request a new link'}
        </Link>
      </div>
    );
  }

  return done ? (
    <div className="text-center space-y-4">
      <div className="bg-emerald-50 text-emerald-700 rounded-xl px-4 py-3 text-sm">
        {locale === 'tr'
          ? 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...'
          : 'Your password has been updated. Redirecting to login...'}
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {locale === 'tr' ? 'Yeni Şifre' : 'New Password'}
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
            placeholder="En az 8 karakter"
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

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {locale === 'tr' ? 'Şifre Tekrar' : 'Confirm Password'}
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-charcoal text-white py-3 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-60"
      >
        {loading ? '...' : (locale === 'tr' ? 'Şifremi Güncelle' : 'Update Password')}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const locale = useLocale();
  return (
    <ShopLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-rose-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-rose-deep" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal">
                {locale === 'tr' ? 'Yeni Şifre Belirle' : 'Set New Password'}
              </h1>
            </div>
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
