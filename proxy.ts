import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'tarekuk_auth';
const PROTECTED_PREFIX = '/dashboard';
const AUTH_ROUTES = ['/login'];

const SAFE_REDIRECT_PREFIXES = [
  '/dashboard',
  '/dashboard/users',
  '/dashboard/transactions',
  '/dashboard/repayments',
  '/dashboard/reports',
  '/dashboard/settings',
] as const;

function isSafeRedirect(redirect: string | null | undefined): boolean {
  if (!redirect) return false;
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return false;
  if (redirect.includes('\\')) return false;
  let decoded = redirect;
  try {
    let prev = '';
    let cur = redirect;
    let iterations = 0;
    while (cur !== prev && iterations < 5) {
      prev = cur;
      cur = decodeURIComponent(cur);
      iterations++;
    }
    decoded = cur;
  } catch {
    return false;
  }
  const lower = decoded.toLowerCase();
  if (lower.includes('..') || lower.includes('%2e') || lower.includes('%2f') || lower.includes('%5c')) return false;
  if (decoded.slice(1).includes('//')) return false;
  const isWhitelisted = SAFE_REDIRECT_PREFIXES.some((p) => decoded === p || decoded.startsWith(p + '/'));
  if (!isWhitelisted) return false;
  try {
    const url = new URL(decoded, 'http://localhost');
    const normalized = url.pathname;
    if (normalized.includes('..') || normalized.includes('//') || normalized.includes('\\')) return false;
    return SAFE_REDIRECT_PREFIXES.some((p) => normalized === p || normalized.startsWith(p + '/'));
  } catch {
    return false;
  }
}

function getSafeRedirect(redirect: string | null | undefined): string {
  return isSafeRedirect(redirect) ? (redirect as string) : '/dashboard';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === '1';

  const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Only preserve safe pathname as redirect; otherwise drop param to avoid reflection
    if (isSafeRedirect(pathname)) {
      url.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const url = request.nextUrl.clone();
    url.pathname = getSafeRedirect(redirect);
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Alias for backward compatibility — Next 16 uses `proxy`, older versions use `middleware`
export const middleware = proxy;

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
