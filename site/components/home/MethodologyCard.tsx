import type { RegimeCode } from '@/lib/home-types';
import { regimeLabel, regimeTone } from '@/lib/format';

type MethodologyContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  regimes: { code: RegimeCode; label?: string }[];
};

/**
 * Texto da seção "Methodology" da Home.
 * Para alterar a copy, edite apenas este objeto - o markup abaixo não muda.
 */
const METHODOLOGY: MethodologyContent = {
  eyebrow: 'Methodology',
  title: 'Clarity over complexity',
  paragraphs: [
    'Automato analyzes USDT, USDC and BTC markets every five minutes, combining market structure, momentum and AI-assisted validation.',
  ],
  /**
   * Regimes explicados na tabela. `label` é opcional: sem ele, usa o rótulo
   * padrão de `lib/format.ts` (Bullish / Balanced / Bearish), o mesmo do hero.
   */
  regimes: [
    { code: 'LONG_STRONG' },
    { code: 'LONG_WEAK' },
    { code: 'NEUTRAL' },
    { code: 'SHORT_WEAK' },
    { code: 'SHORT_STRONG' },
  ],
};

const LABEL_CLASS = {
  long: 'text-emerald-400',
  neutral: 'text-amber-300',
  short: 'text-red-400',
} as const;

export function MethodologyCard() {
  return (
    <div id="methodology" className="rounded-xl border border-white/[0.08] bg-[#121923] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
        {METHODOLOGY.eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold text-white">{METHODOLOGY.title}</h2>

      {METHODOLOGY.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-sm leading-6 text-slate-400">
          {paragraph}
        </p>
      ))}

      <div className="mt-5 space-y-3">
        {METHODOLOGY.regimes.map(({ code, label }) => (
          <div
            key={code}
            className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs last:border-0 last:pb-0"
          >
            <span className="text-slate-300">{code}</span>
            <span className={LABEL_CLASS[regimeTone(code)]}>{label ?? regimeLabel(code)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
