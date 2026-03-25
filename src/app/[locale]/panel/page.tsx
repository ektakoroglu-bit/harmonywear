'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Package, ShoppingCart, Tag, TrendingUp, Eye, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const locale = useLocale() as 'tr' | 'en';
  const { products, discounts, orders } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeDiscounts = discounts.filter(d => d.isActive).length;
  const lowStockProducts = products.filter(p => p.stock.some(s => s.quantity > 0 && s.quantity <= 5));

  const stats = [
    { label: t('totalProducts'), value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: t('totalOrders'), value: orders.length, icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600' },
    { label: t('revenue'), value: formatPrice(totalRevenue), icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
    { label: t('activeDiscounts'), value: activeDiscounts, icon: Tag, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">{t('dashboard')}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {locale === 'tr' ? 'Mağazanıza genel bakış' : 'Your store overview'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Warning */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-amber-600" />
            <h3 className="font-semibold text-amber-800 text-sm">
              {locale === 'tr' ? 'Düşük Stok Uyarısı' : 'Low Stock Warning'}
            </h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-amber-700">{p.name[locale]}</span>
                <span className="text-amber-600 font-medium">
                  {p.stock.filter(s => s.quantity <= 5 && s.quantity > 0).length} {locale === 'tr' ? 'varyant düşük' : 'variants low'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">{t('products')}</h2>
          <span className="text-xs text-gray-500">{products.length} {locale === 'tr' ? 'ürün' : 'products'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t('productName')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t('category')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t('price')}</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{t('stock')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map(product => {
                const totalStock = product.stock.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-charcoal text-sm">{product.name[locale]}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-charcoal">{formatPrice(product.salePrice ?? product.price)}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`text-sm font-medium ${totalStock <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-gray-400 hover:text-charcoal transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
