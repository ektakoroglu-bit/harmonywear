'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Mail } from 'lucide-react';
import ShopLayout from '@/components/layout/ShopLayout';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(locale === 'tr' ? 'Bir hata oluştu, tekrar deneyin.' : 'Something went wrong, try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-rose-pale rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-rose-deep" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-charcoal">
                {locale === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {locale === 'tr'
                  ? 'E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.'
                  : 'Enter your email and we\'ll send you a reset link.'}
              </p>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 text-emerald-700 rounded-xl px-4 py-3 text-sm">
                  {locale === 'tr'
                    ? 'Sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.'
                    : 'A reset link has been sent to your email. Please check your inbox.'}
                </div>
                <Link
                  href={`/${locale}/account/login`}
                  className="block text-sm text-rose-deep font-medium hover:underline"
                >
                  {locale === 'tr' ? 'Giriş sayfasına dön' : 'Back to login'}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {locale === 'tr' ? 'E-posta' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
                      placeholder="ornek@email.com"
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
                  {loading ? '...' : (locale === 'tr' ? 'Sıfırlama Bağlantısı Gönder' : 'Send Reset Link')}
                </button>

                <p className="text-center text-sm text-gray-500">
                  <Link href={`/${locale}/account/login`} className="text-rose-deep font-medium hover:underline">
                    {locale === 'tr' ? 'Giriş sayfasına dön' : 'Back to login'}
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
