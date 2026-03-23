'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterState, ProductCategory, ProductSize } from '@/types';
import { useAdminStore } from '@/store/adminStore';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import ShopLayout from '@/components/layout/ShopLayout';

const defaultFilters: FilterState = {
  category: 'all',
  sizes: [],
  colors: [],
  minPrice: 0,
  maxPrice: 9999,
  inStockOnly: false,
  sortBy: 'newest',
  searchQuery: '',
};

function ProductsContent() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const allProducts = useAdminStore(state => state.products);

  const initialCategory = (searchParams.get('category') || 'all') as ProductCategory | 'all';
  const initialQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: initialCategory,
    searchQuery: initialQuery,
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => setFilters({ ...defaultFilters });

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.sizes.length > 0) {
      products = products.filter(p =>
        p.sizes.some(s => filters.sizes.includes(s as ProductSize))
      );
    }
    if (filters.colors.length > 0) {
      products = products.filter(p =>
        p.colors.some(c => filters.colors.includes(c.name))
      );
    }
    if (filters.inStockOnly) {
      products = products.filter(p => p.stock.some(s => s.quantity > 0));
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.tr.toLowerCase().includes(q) ||
        p.name.en.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.includes(q))
      );
    }
    switch (filters.sortBy) {
      case 'priceAsc': products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case 'priceDesc': products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      case 'popular': products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
      default: products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return products;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{filteredProducts.length} {t('results')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:flex items-center">
            <ArrowUpDown size={15} className="absolute left-3 text-gray-400" />
            <select
              value={filters.sortBy}
              onChange={e => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-rose-blush"
            >
              <option value="newest">{t('sortOptions.newest')}</option>
              <option value="priceAsc">{t('sortOptions.priceAsc')}</option>
              <option value="priceDesc">{t('sortOptions.priceDesc')}</option>
              <option value="popular">{t('sortOptions.popular')}</option>
            </select>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-charcoal hover:bg-cream transition-colors"
          >
            <SlidersHorizontal size={16} />
            {t('filters')}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <ProductFilters
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          productCount={filteredProducts.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-semibold text-charcoal text-lg mb-2">{t('noResults')}</h3>
              <button onClick={clearFilters} className="text-rose-deep text-sm hover:underline mt-2">
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ShopLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-2 border-rose-blush border-t-transparent rounded-full" /></div>}>
        <ProductsContent />
      </Suspense>
    </ShopLayout>
  );
}
