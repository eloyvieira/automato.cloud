'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080d14] px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-0.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg">
            <img src="/images/icone.svg" alt="Automato" className="h-6 w-6" />
          </span>

          <span className="text-lg font-semibold text-white">
            automato<span className="text-[#5bd6e8]">.</span>
          </span>
        </Link>
        <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to access your signals.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-slate-400">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/40" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/40" />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-400 py-2.5 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:opacity-50">{loading ? 'Logging in...' : 'Log in'}</button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">No account? <Link href="/register" className="text-emerald-400 hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
