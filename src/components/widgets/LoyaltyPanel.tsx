'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { X, Star, UserPlus, Bell, ShoppingBag, ChevronRight, Gift, Sparkles } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAdminStore } from '@/store/adminStore';
import { useCartStore } from '@/store/cartStore';
import { LOYALTY_REWARDS } from '@/lib/products';
import { DiscountCode } from '@/types';
import toast from 'react-hot-toast';

export default function LoyaltyPanel() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { currentUser, redeemReward } = useUserStore();
  const addDiscountCode = useAdminStore(s => s.addDiscountCode);
  const applyDiscount = useCartStore(s => s.applyDiscount);

  const tr = locale === 'tr';
  const points = currentUser?.points ?? 0;

  // Next reward the user is working toward
  const nextReward = LOYALTY_REWARDS.find(r => r.points > points);
  const progressPct = nextReward
    ? Math.min(100, (points / nextReward.points) * 100)
    : 100;

  const earnRules = [
    { icon: UserPlus, title: tr ? 'Hesap Oluştur'       : 'Create an Account',      desc: tr ? 'Bir kerelik'            : 'One-time',            pts: 250 },
    { icon: Bell,     title: tr ? 'İletişime İzin Ver'  : 'Allow Communications',   desc: tr ? 'Bülten & bildirimler'   : 'Newsletter & push',    pts: 250 },
    { icon: ShoppingBag, title: tr ? 'Alışveriş Yap'   : 'Make a Purchase',         desc: tr ? 'Her 100₺ harcamanda'   : 'Every 100₺ spent',     pts: 50  },
  ];

  const handleRedeem = (requiredPoints: number, discountValue: number) => {
    const result = redeemReward(requiredPoints, discountValue);
    if (!result.success || !result.code) {
      toast.error(tr ? 'Yeterli puanınız yok.' : 'Not enough points.');
      return;
    }
    // Register the code in admin store then apply to cart
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
    toast.success(tr ? `${discountValue}₺ indirim kodunuz sepete eklendi!` : `${discountValue}₺ reward applied to your cart!`);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button with tooltip */}
      <div className="fixed bottom-6 left-6 z-50 group">
        {/* Tooltip */}
        <div className="absolute bottom-16 left-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <div className="bg-charcoal text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg">
            {tr ? 'Sadakat Programı - Harcadıkça Kazan!' : 'Loyalty Program - Earn as You Shop!'}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-charcoal" />
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label={tr ? 'Sadakat Programı' : 'Loyalty Program'}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
        >
          <Star size={24} className="text-white fill-white" />
        </button>
        {/* Points badge */}
        {currentUser && points > 0 && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight shadow">
            {points >= 1000 ? `${(points / 1000).toFixed(1)}k` : points}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 z-50 w-full sm:w-96 bg-white shadow-2xl rounded-t-3xl sm:rounded-tr-3xl sm:rounded-br-3xl sm:rounded-tl-none sm:rounded-bl-none sm:bottom-0 sm:top-0 sm:h-screen transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full sm:translate-y-0 sm:-translate-x-full'
        }`}
        style={{ maxHeight: '95vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <Star size={22} className="text-yellow-300 fill-yellow-300" />
            <h2 className="text-white font-serif text-xl font-bold">
              {tr ? 'Sadakat Programı' : 'Loyalty Program'}
            </h2>
          </div>

          {currentUser ? (
            /* Logged-in: show points balance */
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-white/70 text-xs mb-1">{tr ? 'Mevcut Puanınız' : 'Your Points Balance'}</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-white font-bold text-3xl">{points.toLocaleString('tr-TR')}</span>
                <span className="text-white/70 text-sm mb-1">{tr ? 'puan' : 'pts'}</span>
              </div>
              {nextReward ? (
                <>
                  <div className="flex justify-between text-xs text-white/70 mb-1">
                    <span>{tr ? 'Sonraki ödül' : 'Next reward'}: {nextReward.label[tr ? 'tr' : 'en']}</span>
                    <span>{nextReward.points - points} {tr ? 'puan kaldı' : 'pts away'}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-yellow-300 text-sm font-semibold">{tr ? 'Tüm ödüllere ulaştınız! 🎉' : 'You unlocked all rewards! 🎉'}</p>
              )}
            </div>
          ) : (
            /* Guest: teaser message */
            <p className="text-white/80 text-xs leading-relaxed">
              {tr
                ? 'Alışveriş yaparak puan kazan, indirim ve ayrıcalıklardan yararlan.'
                : 'Earn points while shopping and enjoy discounts & exclusive perks.'}
            </p>
          )}
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* How to earn */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {tr ? 'Nasıl Puan Kazanırsın?' : 'How to Earn Points'}
            </h3>
            <div className="space-y-2.5">
              {earnRules.map(({ icon: Icon, title, desc, pts }) => (
                <div key={title} className="flex items-center gap-3 p-3 bg-mint-pale rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-mint-light flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-mint-darker" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <span className="text-mint-darker font-bold text-sm shrink-0">+{pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {tr ? 'Ödüllerim' : 'Rewards'}
            </h3>
            <div className="space-y-2.5">
              {LOYALTY_REWARDS.map(reward => {
                const unlocked = points >= reward.points;
                return (
                  <div
                    key={reward.points}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      unlocked
                        ? 'bg-mint-pale border-mint-light'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${unlocked ? 'bg-mint-light' : 'bg-gray-200'}`}>
                      <Gift size={16} className={unlocked ? 'text-mint-darker' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${unlocked ? 'text-charcoal' : 'text-gray-400'}`}>
                        {reward.label[tr ? 'tr' : 'en']}
                      </p>
                      <p className="text-xs text-gray-400">
                        {reward.points.toLocaleString('tr-TR')} {tr ? 'puan' : 'pts'}
                        {!unlocked && currentUser && (
                          <span className="text-mint-darker"> · {(reward.points - points).toLocaleString('tr-TR')} {tr ? 'puan kaldı' : 'pts away'}</span>
                        )}
                      </p>
                    </div>
                    {unlocked && currentUser && (
                      <button
                        onClick={() => handleRedeem(reward.points, reward.discount)}
                        className="shrink-0 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
                      >
                        {tr ? 'Kullan' : 'Redeem'}
                      </button>
                    )}
                    {!unlocked && (
                      <div className="shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">🔒</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          {!currentUser ? (
            <div className="space-y-2 pb-2">
              <Link
                href={`/${locale}/account/register`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
              >
                <span>{tr ? 'Ücretsiz Kayıt Ol' : 'Sign Up Free'}</span>
                <ChevronRight size={18} />
              </Link>
              <Link
                href={`/${locale}/account/login`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-mint-dark text-mint-darker text-sm font-semibold hover:bg-mint-pale transition-colors"
              >
                <span>{tr ? 'Giriş Yap' : 'Log In'}</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pb-2">
              <Link
                href={`/${locale}/account`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3D7D76, #5A9E96)' }}
              >
                <span className="flex items-center gap-2"><Sparkles size={16} />{tr ? 'Puanlarım & Ödüllerim' : 'My Points & Rewards'}</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
