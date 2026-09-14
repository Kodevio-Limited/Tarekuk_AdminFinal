'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import { clearAuth } from '@/lib/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/users': 'Users',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/repayments': 'Repayments',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

const pageSubtitles: Record<string, string> = {
  '/dashboard': 'Overview of your money transfer activity',
  '/dashboard/users': 'Manage and review registered users',
  '/dashboard/transactions': 'Review all money transfers',
  '/dashboard/repayments': 'Manage repayment plans and schedules',
  '/dashboard/reports': 'Transfer and repayment reporting',
  '/dashboard/settings': 'Update your profile and security',
};

export default function Header({
  pathname,
  onMenuToggle,
}: {
  pathname: string;
  onMenuToggle: () => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    router.replace('/login');
    setTimeout(() => {
      window.location.href = '/login';
    }, 50);
  };
  const title = pageTitles[pathname] ?? 'Dashboard';
  const subtitle = pageSubtitles[pathname];

  return (
    <header className="sticky top-0 z-30 flex h-[75px] items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg border border-border p-2 text-navy transition-colors hover:bg-graySoft lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold leading-tight text-navy sm:text-[22px]">{title}</h1>
          {subtitle && <p className="hidden text-sm text-textSecondary sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-border p-1.5 pr-3 transition-colors hover:bg-graySoft"
          >
            <Avatar name="Admin User" color="#FFC107" size="sm" />
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-navy">Admin User</p>
              <p className="text-[10px] text-textSecondary">Super Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-textSecondary" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-navy">Admin User</p>
                  <p className="text-xs text-textSecondary">admin@tarekuk.com</p>
                </div>
                <div className="p-1.5">
                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-navy transition-colors hover:bg-graySoft"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-navy transition-colors hover:bg-graySoft"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger transition-colors hover:bg-dangerSoft"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}