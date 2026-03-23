'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success(t('newsletterBtn'));
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="bg-rose-pale py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-14 h-14 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={24} className="text-rose-deep" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">
          {t('newsletterTitle')}
        </h2>
        <p className="text-gray-600 mb-8">{t('newsletterSubtitle')}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('newsletterPlaceholder')}
            required
            className="flex-1 border border-gray-200 bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-charcoal text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-charcoal-light transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? '...' : t('newsletterBtn')}
          </button>
        </form>
      </div>
    </section>
  );
}
