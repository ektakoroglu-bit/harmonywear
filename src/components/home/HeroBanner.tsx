'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { cn } from '@/lib/utils';

export default function HeroBanner() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('hero');
  const banners = useAdminStore(s => s.banners);
  const [current, setCurrent] = useState(0);

  const activeBanners = [...banners]
    .filter(b => b.isActive)
    .sort((a, b) => a.order - b.order);

  // Reset index when banner list changes
  useEffect(() => {
    setCurrent(0);
  }, [activeBanners.length]);

  // Auto-advance
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[current];
  const isLocal = (src: string) => src.startsWith('/uploads/');

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-screen max-h-[900px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {activeBanners.map((b, idx) => (
        <div
          key={b.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {/* Desktop image */}
          <Image
            src={b.image}
            alt={b.title[locale]}
            fill
            className={cn(
              'object-cover object-center',
              b.imageMobile ? 'hidden sm:block' : 'block'
            )}
            priority={idx === 0}
            sizes="100vw"
            unoptimized={isLocal(b.image)}
          />
          {/* Mobile image */}
          {b.imageMobile && (
            <Image
              src={b.imageMobile}
              alt={b.title[locale]}
              fill
              className="object-cover object-center block sm:hidden"
              priority={idx === 0}
              sizes="100vw"
              unoptimized={isLocal(b.imageMobile)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <span className="inline-block bg-rose-blush text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              {t('badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-4">
              {banner.title[locale]}
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {banner.subtitle[locale]}
            </p>
            <Link
              href={banner.link || `/${locale}/products`}
              className="inline-flex items-center gap-2 bg-white text-charcoal px-8 py-4 rounded-full font-semibold text-sm hover:bg-rose-light transition-all duration-200 hover:gap-3 group"
            >
              {banner.buttonText?.[locale] || t('cta')}
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent(prev => (prev + 1) % activeBanners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            aria-label="Next banner"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to banner ${idx + 1}`}
                className={cn(
                  'rounded-full transition-all duration-300',
                  idx === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
