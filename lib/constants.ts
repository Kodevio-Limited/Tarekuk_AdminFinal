export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout' },
  { label: 'Users', href: '/dashboard/users', icon: 'users' },
  { label: 'Transactions', href: '/dashboard/transactions', icon: 'arrowLeftRight' },
  { label: 'Repayments', href: '/dashboard/repayments', icon: 'wallet' },
  { label: 'Reports', href: '/dashboard/reports', icon: 'barChart' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
] as const;

export const PROVIDERS = [
  'Zenith Bank',
  'GTBank',
  'Access Bank',
  'Chase Bank',
  'Wells Fargo',
  'Revolut',
  'Emirates NBD',
] as const;

export const STATUS_LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
  overdue: 'Overdue',
} as const;