'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

/** Ends the session through the existing /api/auth/logout route. */
export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
    >
      <LogOut size={15} />
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
