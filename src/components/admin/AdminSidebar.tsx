'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Package, Tag, ImageIcon, ShoppingCart, LogOut, Menu, X, Star, Bell } from 'lucide-react';
import { useAdminStore } from '@/store/panelStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function AdminSidebar() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const pathname = usePathname();
  const logout = useAdminStore(s => s.logout);
  const [open, setOpen] = useState(false);

  const pendingReviews = useAdminStore(s => s.reviews.filter(r => r.status === 'pending').length);
  const stockNotifCount = useAdminStore(s => s.stockNotifications.length);

  const navItems = [
    { href: `/${locale}/panel`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/panel/products`, label: t('products'), icon: Package },
    { href: `/${locale}/panel/orders`, label: t('orders'), icon: ShoppingCart },
    { href: `/${locale}/panel/discounts`, label: t('discounts'), icon: Tag },
    { href: `/${locale}/panel/banners`, label: t('banners'), icon: ImageIcon },
    { href: `/${locale}/panel/reviews`, label: 'Yorumlar', icon: Star, badge: pendingReviews },
    { href: `/${locale}/panel/stock-notifications`, label: 'Stok Bildirimleri', icon: Bell, badge: stockNotifCount },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <span className="font-serif text-xl font-bold tracking-[0.2em] text-white">HARMONY</span>
        <p className="text-xs text-gray-400 mt-1">{t('title')}</p>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
              pathname === item.href
                ? 'bg-rose-blush/20 text-rose-blush font-medium'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            )}
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {(item.badge ?? 0) > 0 && (
              <span className="bg-rose-blush text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {(item.badge ?? 0) > 9 ? '9+' : item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 bg-charcoal-dark flex-col min-h-screen shrink-0">
        <NavContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-charcoal rounded-full flex items-center justify-center text-white shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-charcoal-dark flex flex-col">
            <div className="absolute top-4 right-4">
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
