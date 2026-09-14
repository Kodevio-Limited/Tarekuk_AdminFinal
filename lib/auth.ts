// Fake credentials for demo / development — NOT for production use
export const FAKE_CREDENTIALS = {
  email: 'admin@tarekuk.com',
  password: 'Admin123!',
} as const;

export const AUTH_COOKIE_NAME = 'tarekuk_auth';
export const AUTH_STORAGE_KEY = 'tarekuk_auth';

/**
 * Whitelisted safe redirect prefixes — only dashboard routes are allowed.
 * This prevents open-redirect and path traversal via `?redirect=`.
 */
export const SAFE_REDIRECT_PREFIXES = [
  '/dashboard',
  '/dashboard/users',
  '/dashboard/transactions',
  '/dashboard/repayments',
  '/dashboard/reports',
  '/dashboard/settings',
] as const;

/**
 * Validate redirect target to prevent path traversal and open redirects.
 * - Must be a relative path starting with /
 * - Must be inside /dashboard (whitelist prefix)
 * - Blocks `..`, `//`, `\`, and encoded variants `%2e`, `%2f`, `%5c`
 * - Normalizes via decode + check
 */
export function isSafeRedirect(redirect: string | null | undefined): boolean {
  if (!redirect) return false;
  if (typeof redirect !== 'string') return false;
  // Must start with / and not with // (protocol-relative)
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return false;
  // Disallow backslashes
  if (redirect.includes('\\')) return false;

  let decoded = redirect;
  try {
    // Decode repeatedly to catch double-encoding like %252e%252e
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

  // Block path traversal sequences and encoded dots/slashes after decoding
  const lower = decoded.toLowerCase();
  if (lower.includes('..') || lower.includes('%2e') || lower.includes('%2f') || lower.includes('%5c')) {
    return false;
  }
  // Block double-slash inside path (after leading /) which can be used for bypass
  if (decoded.slice(1).includes('//')) return false;

  // Normalize: remove trailing slash for comparison, but keep /dashboard as valid
  // Check against whitelist — exact match or prefix with /
  const isWhitelisted = SAFE_REDIRECT_PREFIXES.some(
    (prefix) => decoded === prefix || decoded.startsWith(prefix + '/')
  );
  if (!isWhitelisted) return false;

  // Final URL sanity: try parsing as relative URL
  try {
    const url = new URL(decoded, 'http://localhost');
    // pathname must still be whitelisted after normalization
    const normalized = url.pathname;
    if (normalized.includes('..') || normalized.includes('//') || normalized.includes('\\')) return false;
    return SAFE_REDIRECT_PREFIXES.some((p) => normalized === p || normalized.startsWith(p + '/'));
  } catch {
    return false;
  }
}

export function getSafeRedirect(redirect: string | null | undefined, fallback = '/dashboard'): string {
  return isSafeRedirect(redirect) ? (redirect as string) : fallback;
}

export function isValidCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === FAKE_CREDENTIALS.email.toLowerCase() && password === FAKE_CREDENTIALS.password;
}

export function setAuthCookie() {
  // 7 days, readable by proxy/middleware and client
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, '1');
  } catch {}
}

export function clearAuth() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const c of cookies) {
    const [rawKey, ...rest] = c.split('=');
    const key = rawKey.trim();
    if (key === name) {
      return rest.join('=').trim();
    }
  }
  return null;
}

export function isAuthenticatedClient(): boolean {
  if (typeof document === 'undefined') return false;
  // Exact cookie parsing — avoids false positives like `my_tarekuk_auth=1`
  return getCookieValue(AUTH_COOKIE_NAME) === '1';
}
