'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const login = useAdminStore(s => s.login);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    const success = login(password);
    if (success) {
      router.replace(`/${locale}/admin`);
    } else {
      setError(locale === 'tr' ? 'Hatalı şifre' : 'Wrong password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-[0.2em] text-white">HARMONY</span>
          <p className="text-gray-400 text-sm mt-2">
            {locale === 'tr' ? 'Yönetim Paneli' : 'Admin Panel'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-14 h-14 bg-rose-pale rounded-full mx-auto mb-6">
            <Lock size={24} className="text-rose-deep" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                {locale === 'tr' ? 'Şifre' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-charcoal text-white py-3 rounded-xl font-semibold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-60"
            >
              {loading ? '...' : (locale === 'tr' ? 'Giriş Yap' : 'Login')}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            Demo: <code className="bg-gray-100 px-1 py-0.5 rounded">harmony2024</code>
          </p>
        </div>
      </div>
    </div>
  );
}
