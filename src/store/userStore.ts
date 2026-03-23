'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, User, RegisterData, SavedAddress, PointsTransaction } from '@/types';

// Simple encoding for demo only – not secure for production
function hashPassword(password: string): string {
  return btoa(encodeURIComponent(password + '_harmony'));
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      register: (data: RegisterData) => {
        const { users } = get();
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, error: 'emailExists' };
        }
        if (data.password.length < 6) {
          return { success: false, error: 'passwordTooShort' };
        }
        const user: User = {
          id: Date.now().toString(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.toLowerCase().trim(),
          passwordHash: hashPassword(data.password),
          phone: data.phone?.trim(),
          addresses: [],
          points: 0,
          pointsHistory: [],
          createdAt: new Date().toISOString(),
        };
        set(state => ({ users: [...state.users, user], currentUser: user }));
        return { success: true };
      },

      login: (email: string, password: string) => {
        const { users } = get();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) return { success: false, error: 'notFound' };
        if (user.passwordHash !== hashPassword(password)) {
          return { success: false, error: 'invalidPassword' };
        }
        set({ currentUser: user });
        return { success: true };
      },

      logout: () => set({ currentUser: null }),

      updateProfile: (updates) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const updated = { ...currentUser, ...updates };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
      },

      changePassword: (currentPassword, newPassword) => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: 'notLoggedIn' };
        if (currentUser.passwordHash !== hashPassword(currentPassword)) {
          return { success: false, error: 'invalidPassword' };
        }
        if (newPassword.length < 6) {
          return { success: false, error: 'passwordTooShort' };
        }
        const updated = { ...currentUser, passwordHash: hashPassword(newPassword) };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
        return { success: true };
      },

      addAddress: (addressData) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const address: SavedAddress = { ...addressData, id: Date.now().toString() };
        const updated = { ...currentUser, addresses: [...currentUser.addresses, address] };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
      },

      removeAddress: (id) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const updated = {
          ...currentUser,
          addresses: currentUser.addresses.filter(a => a.id !== id),
        };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
      },

      addPoints: (amount, reason, description, orderId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const tx: PointsTransaction = {
          id: Date.now().toString(),
          type: amount >= 0 ? 'earned' : 'spent',
          amount: Math.abs(amount),
          reason,
          description,
          orderId,
          createdAt: new Date().toISOString(),
        };
        const updated = {
          ...currentUser,
          points: Math.max(0, (currentUser.points ?? 0) + amount),
          pointsHistory: [tx, ...(currentUser.pointsHistory ?? [])],
        };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
      },

      redeemReward: (requiredPoints, discountValue) => {
        const { currentUser } = get();
        if (!currentUser) return { success: false };
        if ((currentUser.points ?? 0) < requiredPoints) return { success: false };
        const code = `PUAN-${discountValue}-${Date.now().toString(36).toUpperCase()}`;
        const tx: PointsTransaction = {
          id: Date.now().toString(),
          type: 'spent',
          amount: requiredPoints,
          reason: 'redeemed',
          description: `${discountValue}₺ indirim kodu: ${code}`,
          createdAt: new Date().toISOString(),
        };
        const updated = {
          ...currentUser,
          points: (currentUser.points ?? 0) - requiredPoints,
          pointsHistory: [tx, ...(currentUser.pointsHistory ?? [])],
        };
        set(state => ({
          users: state.users.map(u => u.id === updated.id ? updated : u),
          currentUser: updated,
        }));
        return { success: true, code };
      },
    }),
    { name: 'harmony-users' }
  )
);
