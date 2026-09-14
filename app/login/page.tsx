'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { FAKE_CREDENTIALS, isValidCredentials, setAuthCookie, isAuthenticatedClient, getSafeRedirect } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard immediately (respect ?redirect= if safe)
  useEffect(() => {
    if (isAuthenticatedClient()) {
      const target = getSafeRedirect(searchParams.get('redirect'));
      router.replace(target);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    // Simulate network latency for realism
    await new Promise((r) => setTimeout(r, 600));

    if (!isValidCredentials(email, password)) {
      setError('Invalid email or password. Please check the demo credentials below.');
      setLoading(false);
      return;
    }

    setAuthCookie();
    const target = getSafeRedirect(searchParams.get('redirect'));
    router.replace(target);
    // fallback hard navigation in case router cache is stale
    setTimeout(() => {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/dashboard')) {
        window.location.href = target;
      }
    }, 100);
  };

  const fillDemoCredentials = () => {
    setEmail(FAKE_CREDENTIALS.email);
    setPassword(FAKE_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left image panel - hidden on mobile */}
      <div className="hidden w-[46%] flex-col justify-between bg-navyDeep lg:flex relative overflow-hidden">
        {/* Logo overlay */}
        <div className="absolute left-10 top-10 z-10">
          <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg">
            <Image src="/logo.svg" alt="Tarekuk" width={180} height={64} className="h-9 w-auto" priority />
          </div>
        </div>
        {/* Image - replace src with your own image in /public (e.g. /login-cover.jpg) */}
        <Image
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1470&auto=format&fit=crop"
          alt="Tarekuk admin workspace"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        {/* Subtle gradient for logo readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        <p className="absolute bottom-10 left-10 z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Tarekuk. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-sm">
              <Image src="/logo.svg" alt="Tarekuk" width={160} height={56} className="h-8 w-auto" priority />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-navy">Welcome back</h2>
              <p className="mt-1.5 text-sm text-textSecondary">Enter your credentials to access the admin dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tarekuk.com"
                    className="h-11 w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-3 text-sm text-navy placeholder:text-textSecondary/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-navy">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="flex items-center gap-1 text-xs font-medium text-textSecondary hover:text-navy"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-10 text-sm text-navy placeholder:text-textSecondary/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-textSecondary hover:bg-graySoft hover:text-navy"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-danger/20 bg-dangerSoft px-3 py-2.5 text-sm text-danger"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-navyDeep transition hover:bg-accentStrong disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-navyDeep/30 border-t-navyDeep" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-border bg-graySoft/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-textSecondary">Demo credentials</p>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-navy shadow-sm ring-1 ring-border hover:bg-graySoft"
                >
                  Use demo
                </button>
              </div>
              <div className="mt-3 space-y-1.5 font-mono text-xs">
                <p className="flex justify-between">
                  <span className="text-textSecondary">Email</span>
                  <span className="font-medium text-navy">{FAKE_CREDENTIALS.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-textSecondary">Password</span>
                  <span className="font-medium text-navy">{FAKE_CREDENTIALS.password}</span>
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-textSecondary">
                This is a demo login only — no real authentication. Credentials are visible for evaluation.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-textSecondary">
            Protected admin area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-navy" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
