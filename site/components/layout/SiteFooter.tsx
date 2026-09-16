import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { PremiumPreviewToggle } from './PremiumPreviewToggle';

/** Shared footer. The API reference is linked from here (and only here). */
export function SiteFooter({ showPreviewToggle = false }: { showPreviewToggle?: boolean }) {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-0.5 text-sm font-semibold text-slate-300">
          <img src="/images/icone.svg" alt="Automato" className="h-6 w-6" /> automato<span className="text-[#5bd6e8]">.</span>
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/api-docs" className="hover:text-white">API</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/login" className="hover:text-white">Log in</Link>
          {showPreviewToggle && <PremiumPreviewToggle />}
        </div>
        <span>© 2026 Automato. Market intelligence, clearly.</span>
      </div>
    </footer>
  );
}
