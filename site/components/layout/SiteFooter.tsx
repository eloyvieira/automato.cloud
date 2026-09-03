import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

/** Shared footer. The API reference is linked from here (and only here). */
export function SiteFooter() {
  return <footer className="border-t border-white/[0.07]"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-300"><BrainCircuit size={16} className="text-emerald-400" /> automato.</Link><div className="flex gap-5"><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/api-docs" className="hover:text-white">API</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/login" className="hover:text-white">Log in</Link></div><span>© 2026 Automato. Market intelligence, clearly.</span></div></footer>;
}
