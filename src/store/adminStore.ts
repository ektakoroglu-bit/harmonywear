'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminState, Product, DiscountCode, Banner, StockItem, Order, OrderStatus, Review, StockNotification } from '@/types';
import { DISCOUNT_CODES, BANNERS } from '@/lib/products';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? 'needmoneyforporsche';

function adminFetch(path: string, opts?: RequestInit) {
  return fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_PASSWORD,
    },
    credentials: 'include',
    ...opts,
  });
}

export const useAdminStore = create<AdminState & {
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  loadAll: () => Promise<void>;
}>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      products: [] as Product[],
      discounts: DISCOUNT_CODES,   // TODO: migrate to Supabase
      banners: BANNERS,            // TODO: migrate to Supabase
      orders: [] as Order[],
      reviews: [] as Review[],
      stockNotifications: [] as StockNotification[],
      isAuthenticated: false,
      isLoading: false,

      // ── Admin auth ─────────────────────────────────────────────────────────
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      // ── Load products (public — called from storefront) ────────────────────
      loadProducts: async () => {
        try {
          const res = await fetch('/api/products');
          if (!res.ok) return;
          const { products } = await res.json();
          if (products) set({ products });
        } catch (err) {
          console.error('[adminStore.loadProducts]', err);
        }
      },

      // ── Load all data from Supabase (admin only) ───────────────────────────
      loadAll: async () => {
        set({ isLoading: true });
        try {
          const [productsRes, ordersRes] = await Promise.all([
            adminFetch('/api/admin/products'),
            adminFetch('/api/admin/orders'),
          ]);
          const [{ products }, { orders }] = await Promise.all([
            productsRes.json(),
            ordersRes.json(),
          ]);
          set({ products: products ?? [], orders: orders ?? [] });
        } catch (err) {
          console.error('[adminStore.loadAll]', err);
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Products ───────────────────────────────────────────────────────────
      addProduct: (productData) => {
        const tempId = `temp-${Date.now()}`;
        const optimistic: Product = {
          ...productData,
          id: tempId,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ products: [...state.products, optimistic] }));

        adminFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        })
          .then(r => r.json())
          .then(({ product }) => {
            if (product) {
              set(state => ({
                products: state.products.map(p => p.id === tempId ? product : p),
              }));
            }
          })
          .catch(err => {
            console.error('[addProduct]', err);
            set(state => ({ products: state.products.filter(p => p.id !== tempId) }));
          });
      },

      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p),
        }));
        adminFetch(`/api/admin/products/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(updates),
        }).catch(err => console.error('[updateProduct]', err));
      },

      deleteProduct: (id) => {
        const prev = get().products;
        set(state => ({ products: state.products.filter(p => p.id !== id) }));
        adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' })
          .catch(err => {
            console.error('[deleteProduct]', err);
            set({ products: prev }); // rollback
          });
      },

      updateStock: (productId, stockItems: StockItem[]) => {
        set(state => ({
          products: state.products.map(p =>
            p.id === productId ? { ...p, stock: stockItems } : p
          ),
        }));
        adminFetch(`/api/admin/products/${productId}`, {
          method: 'PATCH',
          body: JSON.stringify({ stockOnly: true, stock: stockItems }),
        }).catch(err => console.error('[updateStock]', err));
      },

      // ── Orders ─────────────────────────────────────────────────────────────
      addOrder: (order) => {
        set(state => ({ orders: [order, ...state.orders] }));
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(order),
        }).catch(err => console.error('[addOrder]', err));
      },

      updateOrderStatus: (id, status: OrderStatus) => {
        set(state => ({
          orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
        }));
        adminFetch(`/api/admin/orders/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }).catch(err => console.error('[updateOrderStatus]', err));
      },

      // ── Discounts (localStorage — TODO: migrate) ───────────────────────────
      addDiscountCode: (discountData) => {
        const discount: DiscountCode = { ...discountData, id: Date.now().toString(), usedCount: 0 };
        set(state => ({ discounts: [...state.discounts, discount] }));
      },
      updateDiscountCode: (id, updates) => {
        set(state => ({
          discounts: state.discounts.map(d => d.id === id ? { ...d, ...updates } : d),
        }));
      },
      deleteDiscountCode: (id) => {
        set(state => ({ discounts: state.discounts.filter(d => d.id !== id) }));
      },

      // ── Banners (localStorage — TODO: migrate) ─────────────────────────────
      addBanner: (bannerData) => {
        const banner: Banner = { ...bannerData, id: Date.now().toString() };
        set(state => ({ banners: [...state.banners, banner] }));
      },
      updateBanner: (id, updates) => {
        set(state => ({
          banners: state.banners.map(b => b.id === id ? { ...b, ...updates } : b),
        }));
      },
      deleteBanner: (id) => {
        set(state => ({ banners: state.banners.filter(b => b.id !== id) }));
      },
      reorderBanners: (orderedIds) => {
        set(state => ({
          banners: state.banners.map(b => ({ ...b, order: orderedIds.indexOf(b.id) + 1 })),
        }));
      },

      // ── Reviews (localStorage — TODO: migrate) ─────────────────────────────
      addReview: (reviewData) => {
        const review: Review = {
          ...reviewData,
          id: Date.now().toString(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ reviews: [review, ...state.reviews] }));
      },
      approveReview: (id) => {
        set(state => ({
          reviews: state.reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r),
        }));
      },
      rejectReview: (id) => {
        set(state => ({
          reviews: state.reviews.map(r => r.id === id ? { ...r, status: 'rejected' } : r),
        }));
      },

      // ── Stock notifications (localStorage — TODO: migrate) ─────────────────
      addStockNotification: (data) => {
        const notification: StockNotification = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ stockNotifications: [notification, ...state.stockNotifications] }));
      },
      deleteStockNotification: (id) => {
        set(state => ({
          stockNotifications: state.stockNotifications.filter(n => n.id !== id),
        }));
      },
    }),
    {
      name: 'harmony-admin',
      version: 4,
      partialize: (state) => ({
        // products and orders are loaded from Supabase on mount — no need to persist
        discounts: state.discounts,
        banners: state.banners,
        reviews: state.reviews,
        stockNotifications: state.stockNotifications,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
