'use client';

import Link from 'next/link';
import { BrainCircuit, LockKeyhole, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#080d14]">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-400"><BrainCircuit size={20} /></span>
            <span className="text-lg font-semibold text-white">automato<span className="text-emerald-400">.</span></span>
          </Link>
          <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-red-400/40 hover:text-red-400">Log out</button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Account</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your subscriptions and API access.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
            <div className="flex items-center gap-2 text-amber-300"><LockKeyhole size={16} /><h2 className="text-sm font-semibold text-white">Premium subscription</h2></div>
            <p className="mt-3 text-sm text-slate-400">No active premium subscription.</p>
            <Link href="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">Upgrade to Premium <ArrowRight size={14} /></Link>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
            <div className="flex items-center gap-2 text-amber-300"><LockKeyhole size={16} /><h2 className="text-sm font-semibold text-white">API subscription</h2></div>
            <p className="mt-3 text-sm text-slate-400">No active API subscription.</p>
            <Link href="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">Get API access <ArrowRight size={14} /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
