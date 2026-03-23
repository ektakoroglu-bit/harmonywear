'use client';

import { useTranslations } from 'next-intl';
import { X, SlidersHorizontal } from 'lucide-react';
import { FilterState, ProductCategory, ProductSize } from '@/types';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
  productCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
const COLORS = [
  { name: 'black', hex: '#1A1A1A', labelTr: 'Siyah', labelEn: 'Black' },
  { name: 'nude', hex: '#D4A896', labelTr: 'Ten Rengi', labelEn: 'Nude' },
  { name: 'blush', hex: '#F2C4C4', labelTr: 'Pudra', labelEn: 'Blush' },
  { name: 'white', hex: '#F5F5F5', labelTr: 'Beyaz', labelEn: 'White' },
  { name: 'ivory', hex: '#FFFFF0', labelTr: 'Kırık Beyaz', labelEn: 'Ivory' },
  { name: 'burgundy', hex: '#800020', labelTr: 'Bordo', labelEn: 'Burgundy' },
];

const CATEGORIES = ['all', 'bodysuits', 'shapewear', 'bras', 'briefs', 'sets'] as const;

export default function ProductFilters({
  filters,
  onChange,
  onClear,
  productCount,
  mobileOpen,
  onMobileClose,
}: ProductFiltersProps) {
  const t = useTranslations('products');
  const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'tr';

  const toggleSize = (size: ProductSize) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onChange({ sizes });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onChange({ colors });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.inStockOnly;

  const FilterContent = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-3">
          {t('filters')}
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat as ProductCategory | 'all' })}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                filters.category === cat
                  ? 'bg-charcoal text-white font-medium'
                  : 'text-gray-600 hover:bg-cream'
              )}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-3">
          {t('sizes')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors',
                filters.sizes.includes(size)
                  ? 'border-charcoal bg-charcoal text-white'
                  : 'border-gray-200 text-gray-600 hover:border-charcoal'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-3">
          {t('colors')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={locale === 'tr' ? color.labelTr : color.labelEn}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                filters.colors.includes(color.name)
                  ? 'border-charcoal scale-110 shadow-md'
                  : 'border-transparent hover:border-gray-300'
              )}
              style={{ backgroundColor: color.hex, outline: color.name === 'white' || color.name === 'ivory' ? '1px solid #e5e7eb' : 'none', outlineOffset: '2px' }}
            />
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
            className={cn(
              'w-10 h-6 rounded-full transition-colors relative',
              filters.inStockOnly ? 'bg-charcoal' : 'bg-gray-200'
            )}
          >
            <div className={cn(
              'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
              filters.inStockOnly ? 'translate-x-5' : 'translate-x-1'
            )} />
          </div>
          <span className="text-sm text-gray-700">{t('inStock')}</span>
        </label>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 text-sm text-rose-deep hover:underline py-2"
        >
          <X size={14} />
          {t('clearFilters')}
        </button>
      )}

      <p className="text-xs text-gray-400 text-center">
        {productCount} {t('results')}
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-64 shrink-0">
        <FilterContent />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-semibold text-charcoal">
                <SlidersHorizontal size={18} />
                {t('filters')}
              </div>
              <button onClick={onMobileClose} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
