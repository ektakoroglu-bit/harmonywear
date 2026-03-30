'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserState, User, RegisterData, SavedAddress } from '@/types';

// Strips passwordHash before storing — server never sends it to the client anyway
function sanitize(user: User): User {
  const { passwordHash: _pw, ...safe } = user as User & { passwordHash?: string };
  return safe as User;
}

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send httpOnly session cookie
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'request failed');
  return json;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [], // unused — data lives in Supabase
      currentUser: null,

      register: async (data: RegisterData) => {
        try {
          const json = await api<{ user: User }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
          });
          set({ currentUser: sanitize(json.user) });
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'serverError';
          return { success: false, error: msg };
        }
      },

      login: async (email: string, password: string) => {
        try {
          const json = await api<{ user: User }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          set({ currentUser: sanitize(json.user) });
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'serverError';
          return { success: false, error: msg };
        }
      },

      logout: () => {
        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
        set({ currentUser: null });
      },

      updateProfile: async (updates) => {
        const { currentUser } = get();
        if (!currentUser) return;
        // Optimistic
        set({ currentUser: { ...currentUser, ...updates } });
        try {
          const json = await api<{ user: User }>('/api/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(updates),
          });
          set({ currentUser: sanitize(json.user) });
        } catch {
          set({ currentUser }); // rollback
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await api('/api/auth/profile', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
          });
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'serverError';
          return { success: false, error: msg };
        }
      },

      addAddress: async (addressData: Omit<SavedAddress, 'id'>) => {
        const { currentUser } = get();
        if (!currentUser) return;
        try {
          const json = await api<{ user: User }>('/api/auth/address', {
            method: 'POST',
            body: JSON.stringify(addressData),
          });
          set({ currentUser: sanitize(json.user) });
        } catch {
          // silently fail — UI should show a toast
        }
      },

      removeAddress: async (id: string) => {
        const { currentUser } = get();
        if (!currentUser) return;
        // Optimistic
        const updated = { ...currentUser, addresses: currentUser.addresses.filter(a => a.id !== id) };
        set({ currentUser: updated });
        try {
          const json = await api<{ user: User }>('/api/auth/address', {
            method: 'DELETE',
            body: JSON.stringify({ addressId: id }),
          });
          set({ currentUser: sanitize(json.user) });
        } catch {
          set({ currentUser }); // rollback
        }
      },

      addPoints: async (amount, reason, description, orderId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        // Optimistic
        const optimistic = {
          ...currentUser,
          points: Math.max(0, (currentUser.points ?? 0) + amount),
        };
        set({ currentUser: optimistic });
        try {
          const json = await api<{ user: User }>('/api/auth/points', {
            method: 'POST',
            body: JSON.stringify({ amount, reason, description, orderId }),
          });
          set({ currentUser: sanitize(json.user) });
        } catch {
          set({ currentUser }); // rollback
        }
      },

      redeemReward: async (requiredPoints: number, discountValue: number) => {
        const { currentUser } = get();
        if (!currentUser) return { success: false };
        if ((currentUser.points ?? 0) < requiredPoints) return { success: false };
        try {
          const json = await api<{ code: string }>('/api/auth/points', {
            method: 'POST',
            body: JSON.stringify({ action: 'redeem', requiredPoints, discountValue }),
          });
          set({
            currentUser: {
              ...currentUser,
              points: (currentUser.points ?? 0) - requiredPoints,
            },
          });
          return { success: true, code: json.code };
        } catch {
          return { success: false };
        }
      },
    }),
    {
      name: 'harmony-user-session',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
