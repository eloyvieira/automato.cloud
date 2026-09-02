'use client';

import Link from 'next/link';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import type { Direction, Signal } from '@/lib/home-types';
import { RegimeBadge } from './RegimeBadge';
import { usePremiumPreview } from './PremiumPreview';

export function SignalCard({ signal, direction }: { signal: Signal; direction: Direction }) {
  const { premium } = usePremiumPreview();

  return (
    <article className="group rounded-xl border border-white/[0.08] bg-[#121923] p-4 transition hover:border-white/20 hover:bg-[#151f2b]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{signal.symbol}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2"><RegimeBadge tone={direction}>{signal.regime}</RegimeBadge><span className="text-xs text-slate-500">{signal.age}</span></div>
        </div>
        <div className="text-right"><p className="text-lg font-semibold text-emerald-400">{signal.reliability}%</p><p className="text-[10px] uppercase tracking-wider text-slate-500">reliability</p></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs"><div><p className="text-slate-500">Strategy</p><p className="mt-1 text-slate-200">{signal.strategy}</p></div><div><p className="text-slate-500">Timeframe</p><p className="mt-1 text-slate-200">{signal.timeframe}</p></div></div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-3 text-xs">
        {[['Entry', signal.entry], ['Stop loss', signal.stop], ['Take profit 1', signal.tp1], ['Take profit 2', signal.tp2]].map(([label, value]) => <div key={label}><p className="text-slate-500">{label}</p><p className={`mt-1 font-medium ${premium ? 'text-slate-100' : 'text-slate-600 blur-[3px] select-none'}`}>{premium ? value : '••••••'}</p></div>)}
      </div>
      {!premium && <Link href="/pricing" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/15"><LockKeyhole size={13} /> Unlock full signal <ArrowRight size={13} /></Link>}
    </article>
  );
}
