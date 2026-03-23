'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem, Product, ProductSize, ProductColor } from '@/types';
import { validateDiscountCode, calculateDiscount } from '@/lib/products';
import { DiscountCode } from '@/types';

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_COST = 40;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountAmount: 0,
      discountMinOrder: null,
      discountType: null,
      discountValue: 0,

      addItem: (product: Product, size: ProductSize, color: ProductColor, quantity = 1) => {
        set(state => {
          const existing = state.items.find(
            item =>
              item.product.id === product.id &&
              item.size === size &&
              item.color.name === color.name
          );

          if (existing) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id &&
                item.size === size &&
                item.color.name === color.name
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, size, color, quantity }],
          };
        });
      },

      removeItem: (productId: string, size: ProductSize, color: string) => {
        set(state => ({
          items: state.items.filter(
            item =>
              !(
                item.product.id === productId &&
                item.size === size &&
                item.color.name === color
              )
          ),
        }));
      },

      updateQuantity: (productId: string, size: ProductSize, color: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId &&
            item.size === size &&
            item.color.name === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      applyDiscount: (code: string, discounts: DiscountCode[]) => {
        const subtotal = get().getSubtotal();
        const discount = validateDiscountCode(code, subtotal, discounts);
        if (!discount) return false;

        set({
          discountCode: code,
          discountAmount: calculateDiscount(discount, subtotal),
          discountMinOrder: discount.minOrder ?? null,
          discountType: discount.type,
          discountValue: discount.value,
        });
        return true;
      },

      removeDiscount: () => {
        set({ discountCode: null, discountAmount: 0, discountMinOrder: null, discountType: null, discountValue: 0 });
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountAmount: 0, discountMinOrder: null, discountType: null, discountValue: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.salePrice ?? item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getDiscountAmount: () => {
        const state = get();
        if (!state.discountCode || !state.discountType) return 0;
        const subtotal = state.getSubtotal();
        if (subtotal === 0) return 0;
        if (state.discountMinOrder && subtotal < state.discountMinOrder) return 0;
        if (state.discountType === 'percentage') {
          return (subtotal * state.discountValue) / 100;
        }
        return Math.min(state.discountValue, subtotal);
      },

      getTotal: () => {
        const state = get();
        return Math.max(0, state.getSubtotal() + state.getShipping() - state.getDiscountAmount());
      },
    }),
    {
      name: 'harmony-cart',
    }
  )
);
