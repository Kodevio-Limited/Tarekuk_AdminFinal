'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { isAuthenticatedClient } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Client-side guard in addition to proxy/middleware (covers edge cases like cookie cleared client-side)
  // Runs once on mount — layout persists across dashboard navigations, so pathname must NOT be in deps
  useEffect(() => {
    if (!isAuthenticatedClient()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:ml-[255px]">
        <Header pathname={pathname} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex min-h-[calc(100dvh-75px)] flex-1 flex-col gap-6 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}