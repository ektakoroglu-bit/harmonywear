import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

const categories = [
  {
    key: 'bodysuits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    labelTr: 'Bodysuitler',
    labelEn: 'Bodysuits',
  },
  {
    key: 'shapewear',
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&q=80',
    labelTr: 'Vücut Şekillendirici',
    labelEn: 'Shapewear',
  },
  {
    key: 'bras',
    image: 'https://images.unsplash.com/photo-1616430888526-4fd40e9f1c1b?w=600&q=80',
    labelTr: 'Sutyenler',
    labelEn: 'Bras',
  },
  {
    key: 'sets',
    image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80',
    labelTr: 'Takımlar',
    labelEn: 'Sets',
  },
];

export default function CategorySection() {
  const locale = useLocale() as 'tr' | 'en';
  const t = useTranslations('home');

  return (
    <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal">
          {t('categoriesTitle')}
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map(cat => (
          <div
            key={cat.key}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
          >
            <Link
              href={`/${locale}/products?category=${cat.key}`}
              className="absolute inset-0 z-10"
              aria-label={locale === 'tr' ? cat.labelTr : cat.labelEn}
            />
            <Image
              src={cat.image}
              alt={locale === 'tr' ? cat.labelTr : cat.labelEn}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-semibold text-sm sm:text-base leading-tight">
                {locale === 'tr' ? cat.labelTr : cat.labelEn}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
