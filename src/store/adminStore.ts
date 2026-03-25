'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminState, Product, DiscountCode, Banner, StockItem, Order, Review, StockNotification } from '@/types';
import { PRODUCTS, DISCOUNT_CODES, BANNERS } from '@/lib/products';

const ADMIN_PASSWORD = 'needmoneyforporsche';

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      discounts: DISCOUNT_CODES,
      banners: BANNERS,
      orders: [] as Order[],
      reviews: [] as Review[],
      stockNotifications: [] as StockNotification[],
      isAuthenticated: false,

      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      addProduct: (productData) => {
        const product: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ products: [...state.products, product] }));
      },

      updateProduct: (id, updates) => {
        set(state => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p),
        }));
      },

      deleteProduct: (id) => {
        set(state => ({ products: state.products.filter(p => p.id !== id) }));
      },

      updateStock: (productId, stockItems: StockItem[]) => {
        set(state => ({
          products: state.products.map(p =>
            p.id === productId ? { ...p, stock: stockItems } : p
          ),
        }));
      },

      addOrder: (order) => {
        set(state => ({ orders: [order, ...state.orders] }));
      },

      updateOrderStatus: (id, status) => {
        set(state => ({
          orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
        }));
      },

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
          banners: state.banners.map(b => ({
            ...b,
            order: orderedIds.indexOf(b.id) + 1,
          })),
        }));
      },

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
      version: 3,
      migrate: (persistedState: unknown, fromVersion: number) => {
        const state = (persistedState ?? {}) as Record<string, unknown>;
        if (fromVersion === 0) {
          const stored: DiscountCode[] = Array.isArray(state.discounts) ? state.discounts as DiscountCode[] : [];
          const refreshed = stored.map((d: DiscountCode) => {
            const fresh = DISCOUNT_CODES.find(dc => dc.id === d.id);
            return fresh ? { ...fresh } : d;
          });
          for (const dc of DISCOUNT_CODES) {
            if (!refreshed.find(d => d.id === dc.id)) refreshed.push({ ...dc });
          }
          return { ...state, discounts: refreshed, reviews: [], stockNotifications: [] };
        }
        if (fromVersion === 1) {
          return { ...state, reviews: state.reviews ?? [], stockNotifications: state.stockNotifications ?? [] };
        }
        if (fromVersion === 2) {
          return { ...state };
        }
        return state;
      },
      partialize: (state) => ({
        products: state.products,
        discounts: state.discounts,
        banners: state.banners,
        orders: state.orders,
        reviews: state.reviews,
        stockNotifications: state.stockNotifications,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
