'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';

/**
 * Enforces guest cart rules:
 * 1. Clears the cart on every new browser session for guest users.
 * 2. Removes the WELCOME5 discount if the user logs out mid-session.
 */
export default function GuestCartGuard() {
  const currentUser = useUserStore(state => state.currentUser);
  const discountCode = useCartStore(state => state.discountCode);
  const removeDiscount = useCartStore(state => state.removeDiscount);
  const clearCart = useCartStore(state => state.clearCart);

  const prevUserRef = useRef(currentUser);

  // On mount: new browser session + guest → clear entire cart
  useEffect(() => {
    const SESSION_KEY = 'harmony-cart-session';
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, '1');
    if (isNewSession && !currentUser) {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user logs out, strip any WELCOME5 discount left in the cart
  useEffect(() => {
    const wasLoggedIn = prevUserRef.current;
    prevUserRef.current = currentUser;
    if (wasLoggedIn && !currentUser && discountCode === 'WELCOME5') {
      removeDiscount();
    }
  }, [currentUser, discountCode, removeDiscount]);

  return null;
}
