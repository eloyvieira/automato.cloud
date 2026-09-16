'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';

const FIELD_CLASS =
  'mt-1 w-full rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/40';

/**
 * Change Password module. Validation is duplicated on the server: the current
 * password is verified and the new one is hashed in the API route.
 */
export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not update your password');

      setSuccess('Your password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Stay on /account, with fresh server data.
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
      <div className="flex items-center gap-2 text-emerald-400">
        <KeyRound size={16} />
        <h2 className="text-sm font-semibold text-white">Change Password</h2>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        Use at least 8 characters. You will stay logged in on this device.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="text-xs text-slate-400" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Your current password"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Repeat the new password"
            className={FIELD_CLASS}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-xs text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-400">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-400 py-2.5 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
