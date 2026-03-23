'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAdminStore } from '@/store/adminStore';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  const loginPath = `/${locale}/admin/login`;
  const isLoginPage = pathname === loginPath;
  // Wait for Zustand persist to rehydrate from localStorage before checking auth.
  // Without this, isAuthenticated is always false on the first render (SSR default),
  // causing an immediate redirect that clears a valid session on every page refresh.
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.replace(loginPath);
    }
  }, [mounted, isAuthenticated, isLoginPage, loginPath, router]);

  if (isLoginPage) return <>{children}</>;
  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
