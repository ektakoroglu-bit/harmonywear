'use client';

import { useEffect, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';

// Mounts once in ShopLayout. Loads products from Supabase into the store
// so every storefront page has live data without re-fetching on each navigation.
export default function StoreInitializer() {
  const initialized = useRef(false);
  const loadProducts = useAdminStore(s => s.loadProducts);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadProducts();
  }, [loadProducts]);

  return null;
}
