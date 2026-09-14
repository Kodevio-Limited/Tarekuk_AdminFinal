'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { clearAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutDashboard,
  users: Users,
  arrowLeftRight: ArrowLeftRight,
  wallet: Wallet,
  barChart: BarChart3,
  settings: Settings,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    onClose();
    router.replace('/login');
    // ensure proxy/middleware sees cleared cookie
    setTimeout(() => {
      window.location.href = '/login';
    }, 50);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-navyDeep/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col bg-navyDeep text-white transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 bg-white px-4">
          <Image src="/logo.svg" alt="Tarekuk" width={308} height={109} className="h-14 w-auto" priority />
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-navy transition-colors hover:bg-graySoft lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-accent text-navyDeep'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}