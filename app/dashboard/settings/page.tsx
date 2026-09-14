'use client';
import { useState, type FormEvent } from 'react';
import { Camera, Save, ShieldCheck, Loader2 } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Avatar from '@/components/shared/Avatar';
import Reveal from '@/components/shared/Reveal';

type Tab = 'profile' | 'security';

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 800);
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <Reveal>
      <div className="flex rounded-lg border border-border bg-surface p-1">
        {(['profile', 'security'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-accent text-navyDeep' : 'text-textSecondary hover:text-navy'
            }`}
          >
            {t === 'profile' ? 'Profile Information' : 'Security / Password'}
          </button>
        ))}
      </div>
      </Reveal>

      <Reveal>
      {tab === 'profile' ? (
        <Card className="flex flex-1 flex-col">
          <form onSubmit={handleSave} className="flex flex-1 flex-col justify-start gap-7 p-2 sm:p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <Avatar name="Admin User" size="lg" color="#FFC107" />
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 rounded-full border border-border bg-surface p-1.5 text-navy shadow-sm transition-colors hover:bg-graySoft"
                  aria-label="Change profile image"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Profile Image</p>
                <p className="text-xs text-textSecondary">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Full Name</label>
                <input
                  defaultValue="Admin User"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Role</label>
                <input
                  defaultValue="Super Admin"
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-lg border border-border bg-graySoft/50 px-3 text-sm text-textSecondary outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Email / Gmail</label>
                <input
                  defaultValue="admin@tarekuk.com"
                  type="email"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Phone Number</label>
                <input
                  defaultValue="+1 555 123 4567"
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-start gap-3 border-t border-border pt-5">
              {saved && <span className="text-sm font-medium text-success">Profile saved.</span>}
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="flex flex-1 flex-col">
          <form onSubmit={handleSave} className="flex flex-1 flex-col justify-start gap-7 p-2 sm:p-6">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-graySoft/50 p-4">
              <div className="rounded-lg bg-successSoft p-2 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Account Security</p>
                <p className="text-xs text-textSecondary">Manage your password and active sessions.</p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
              />
            </div>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  className="h-10 w-full rounded-lg border border-border px-3 text-sm text-navy outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-start gap-3 border-t border-border pt-5">
              {saved && <span className="text-sm font-medium text-success">Password updated.</span>}
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {saving ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      </Reveal>
    </div>
  );
}