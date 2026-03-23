'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { X, Gift, Star } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function WelcomePopup() {
  const locale = useLocale();
  const currentUser = useUserStore(state => state.currentUser);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tr = locale === 'tr';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || currentUser) return;
    if (sessionStorage.getItem('welcome-popup-shown')) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [mounted, currentUser]);

  useEffect(() => {
    if (visible) sessionStorage.setItem('welcome-popup-shown', '1');
  }, [visible]);

  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-white transition-colors shadow-sm"
          >
            <X size={16} />
          </button>

          {/* Header gradient */}
          <div
            className="px-8 pt-10 pb-8 text-center"
            style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Gift size={32} className="text-white" />
            </div>
            <h2 className="text-white font-serif text-2xl font-bold mb-2">
              {tr ? 'Harmony\'ye Hoş Geldiniz!' : 'Welcome to Harmony!'}
            </h2>
            <p className="text-white/85 text-sm leading-relaxed">
              {tr
                ? 'Premium shapewear koleksiyonumuzu keşfetmek için doğru yerdesiniz.'
                : 'You\'ve found the right place for premium shapewear.'}
            </p>
          </div>

          {/* Offer */}
          <div className="px-8 py-6 text-center">
            {/* Discount badge */}
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3 mb-5">
              <Star size={18} className="text-rose-400 fill-rose-400" />
              <span className="text-rose-600 font-bold text-lg">
                {tr ? 'İlk Siparişinize %5 İndirim' : '5% Off Your First Order'}
              </span>
              <Star size={18} className="text-rose-400 fill-rose-400" />
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {tr
                ? 'Hesap oluştur, ilk siparişinde %5 indirim kazan ve 500 puan hediye al!'
                : 'Create an account, get 5% off your first order and receive 500 bonus points!'}
            </p>

            <div className="space-y-2.5">
              <Link
                href={`/${locale}/account/register`}
                onClick={dismiss}
                className="flex items-center justify-center w-full px-6 py-3.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
              >
                {tr ? 'Ücretsiz Hesap Oluştur' : 'Create Free Account'}
              </Link>
              <button
                onClick={dismiss}
                className="w-full px-6 py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                {tr ? 'Şimdi değil' : 'Not now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
