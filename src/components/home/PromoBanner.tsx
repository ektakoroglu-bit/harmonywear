import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

export default function PromoBanner() {
  const locale = useLocale();
  const t = useTranslations('home');

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-charcoal h-64 sm:h-72 lg:h-80">
        <Image
          src="https://images.unsplash.com/photo-1558171813-57d44e2a5db0?w=1400&q=80"
          alt="Promotion"
          fill
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <p className="text-rose-blush text-sm font-semibold uppercase tracking-widest mb-3">
              {t('promoTitle')}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('promoSubtitle')}
            </h2>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center bg-white text-charcoal px-8 py-3 rounded-full text-sm font-semibold hover:bg-rose-light transition-colors"
            >
              {t('promoBtn')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
