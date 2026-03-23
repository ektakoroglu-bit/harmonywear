'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, Search, Menu, X, Globe, Heart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useAdminStore } from '@/store/adminStore';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const categories = ['bodysuits', 'shapewear', 'bras', 'briefs', 'sets'] as const;

export default function Header() {
  const t = useTranslations('nav');
  const tc = useTranslations('products.categories');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore(state => state.getTotalItems());
  const currentUser = useUserStore(state => state.currentUser);
  const allProducts = useAdminStore(state => state.products);
  const [mounted, setMounted] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [pathname]);

  const switchLocale = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Live search results
  const searchResults = searchQuery.trim()
    ? allProducts.filter(p => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.tr.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.tags?.some(tag => tag.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const showDropdown = searchOpen && searchQuery.trim().length > 0;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      {/* Top bar */}
      <div className="bg-mint-darker text-white text-xs py-2 text-center tracking-widest">
        {locale === 'tr' ? '1.000₺ ÜZERİ ÜCRETSİZ KARGO | KODU: HARMONY10 → %10 İNDİRİM' : 'FREE SHIPPING OVER 1.000₺ | CODE: HARMONY10 → 10% OFF'}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-rose-deep transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex flex-col items-center leading-none group">
            <span
              className="font-serif font-normal text-[1.65rem] tracking-wide text-mint-darker group-hover:text-mint-dark transition-colors"
              style={{ letterSpacing: '0.04em' }}
            >
              Harm<span style={{ fontStyle: 'italic' }}>ó</span>ny
            </span>
            <span className="text-[0.45rem] tracking-[0.25em] uppercase text-mint-dark font-sans font-light mt-0.5">
              Shapewear for Women
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href={`/${locale}/products`} className="text-sm font-medium text-charcoal hover:text-rose-deep transition-colors tracking-wide uppercase">
              {t('products')}
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/${locale}/products?category=${cat}`}
                className="text-sm text-gray-600 hover:text-rose-deep transition-colors"
              >
                {tc(cat)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-charcoal hover:text-rose-deep transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={switchLocale}
              className="p-2 text-charcoal hover:text-rose-deep transition-colors hidden sm:flex items-center gap-1"
            >
              <Globe size={18} />
              <span className="text-xs font-medium uppercase">{locale === 'tr' ? 'EN' : 'TR'}</span>
            </button>
            <button className="p-2 text-charcoal hover:text-rose-deep transition-colors hidden sm:block">
              <Heart size={20} />
            </button>
            <Link
              href={mounted && currentUser ? `/${locale}/account` : `/${locale}/account/login`}
              className="p-2 text-charcoal hover:text-rose-deep transition-colors hidden sm:flex items-center"
              title={mounted && currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : undefined}
            >
              <User size={20} />
            </Link>
            <Link href={`/${locale}/cart`} className="p-2 text-charcoal hover:text-rose-deep transition-colors relative">
              <ShoppingBag size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-blush text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar + Dropdown */}
        {searchOpen && (
          <div ref={searchContainerRef} className="pb-3 border-t border-gray-100 animate-fade-in relative">
            <form onSubmit={handleSearch} className="flex gap-2 pt-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-blush"
              />
              <button
                type="submit"
                className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm hover:bg-charcoal-light transition-colors"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Live results dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400 text-center">Sonuç bulunamadı</p>
                ) : (
                  <ul>
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition-colors"
                        >
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name[locale as 'tr' | 'en']}
                                fill
                                unoptimized={product.images[0].startsWith('data:')}
                                className="object-cover"
                                sizes="40px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal truncate">
                              {product.name[locale as 'tr' | 'en']}
                            </p>
                            <p className="text-xs text-rose-deep font-semibold mt-0.5">
                              {formatPrice(product.salePrice ?? product.price)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    {allProducts.filter(p => {
                      const q = searchQuery.toLowerCase();
                      return p.name.tr.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q));
                    }).length > 6 && (
                      <li className="border-t border-gray-100">
                        <button
                          onClick={handleSearch as unknown as React.MouseEventHandler}
                          className="w-full px-4 py-2.5 text-xs text-center text-rose-deep hover:bg-cream transition-colors font-medium"
                        >
                          {locale === 'tr' ? 'Tüm sonuçları gör →' : 'See all results →'}
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <Link
              href={`/${locale}/products`}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-3 text-sm font-medium text-charcoal hover:bg-cream rounded-lg"
            >
              {t('products')}
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                href={`/${locale}/products?category=${cat}`}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 text-sm text-gray-600 hover:bg-cream rounded-lg capitalize"
              >
                {tc(cat)}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            <button
              onClick={() => { switchLocale(); setMobileOpen(false); }}
              className="py-2.5 px-3 text-sm text-charcoal hover:bg-cream rounded-lg flex items-center gap-2 w-full text-left"
            >
              <Globe size={16} />
              {locale === 'tr' ? 'English' : 'Türkçe'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
