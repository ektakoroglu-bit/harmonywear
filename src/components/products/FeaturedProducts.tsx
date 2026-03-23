import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { ChevronRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  title: string;
  subtitle?: string;
  viewAllLabel?: string;
}

export default function FeaturedProducts({ products, title, subtitle, viewAllLabel }: FeaturedProductsProps) {
  const locale = useLocale();
  const t = useTranslations('common');

  return (
    <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <Link
          href={`/${locale}/products`}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-rose-deep hover:gap-2 transition-all group"
        >
          {viewAllLabel || t('viewAll')}
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.slice(0, 8).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="sm:hidden text-center mt-8">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-deep border border-rose-blush rounded-full px-6 py-2.5 hover:bg-rose-pale transition-colors"
        >
          {viewAllLabel || t('viewAll')}
          <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  );
}
