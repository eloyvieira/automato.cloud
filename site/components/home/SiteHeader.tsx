'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { usePremiumPreview } from './PremiumPreview';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { premium, toggle } = usePremiumPreview();

  return <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080d14]/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-400"><BrainCircuit size={20} /></span><span className="text-lg font-semibold tracking-tight text-white">automato<span className="text-emerald-400">.</span></span></Link><nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex"><Link className="transition hover:text-white" href="#signals">Signals</Link><Link className="transition hover:text-white" href="/rankings">Rankings</Link><Link className="transition hover:text-white" href="#methodology">How it works</Link><Link className="transition hover:text-white" href="/pricing">Pricing</Link><Link className="transition hover:text-white" href="/api-docs">API</Link></nav><div className="hidden items-center gap-4 md:flex"><button onClick={toggle} className="text-xs text-slate-500 hover:text-white">{premium ? 'Preview free view' : 'Preview premium'}</button><Link href="/login" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-emerald-400/40 hover:text-emerald-400">Log in</Link><Link href="/register" className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300">Get started</Link></div><button className="text-slate-300 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <nav className="border-t border-white/[0.07] px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm text-slate-300"><Link href="#signals" onClick={() => setMenuOpen(false)}>Signals</Link><Link href="/rankings">Rankings</Link><Link href="#methodology" onClick={() => setMenuOpen(false)}>How it works</Link><Link href="/pricing">Pricing</Link><Link href="/login">Log in</Link></div></nav>}</header>;
}
