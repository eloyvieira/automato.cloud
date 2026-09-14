import type { Direction, Signal } from '@/lib/home-types';
import { Info } from 'lucide-react';
import { RegimeBadge } from './RegimeBadge';

export function SignalCard({
  signal,
  direction,
}: {
  signal: Signal;
  direction: Direction;
}) {
  return (
    <article className="group rounded-xl border border-white/[0.08] bg-[#121923] p-4 transition hover:border-white/20 hover:bg-[#151f2b]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {signal.symbol}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RegimeBadge tone={direction}>
              {signal.regime}
            </RegimeBadge>

            <span className="text-xs text-slate-500">
              {signal.age}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-semibold ${
              signal.mfe !== '--' && parseFloat(signal.mfe) < 0
                ? 'text-red-400'
                : 'text-emerald-400'
            }`}
          >
            {signal.mfe !== '--' ? signal.mfe : '--'}
          </p>

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            MFE
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-y-3 text-xs sm:grid-cols-3">
        <div>
          <p className="text-slate-500">Strategy</p>
          <p className="mt-1 text-slate-200">
            {signal.strategy}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Timeframe</p>
          <p className="mt-1 text-slate-200">
            {signal.timeframe}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Category</p>
          <p className="mt-1 text-slate-200">
            {signal.category}
          </p>
        </div>
      </div>

      <div
        className="mt-4 gap-2 border-t border-white/[0.06] pt-3 text-xs"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        }}
      >
        {(
          [
            ['Entry', signal.entry],
            ['Stop loss', signal.stop],
            ['MAE', signal.mae],
          ] as const
        ).map(([label, value]) => {
          const isMaeNegative =
            label === 'MAE' &&
            value !== '--' &&
            parseFloat(value) < 0;

          return (
            <div key={label} className="min-w-0">
              <div className="inline-flex items-center gap-1">
                <span className="text-slate-500">{label}</span>

                {label === 'Stop loss' && (
                  <div className="group/tooltip relative inline-flex">
                    <Info
                      size={12}
                      className="cursor-help text-slate-500 hover:text-slate-300"
                    />

                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-72 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0b1118] p-3 text-left text-xs leading-relaxed text-slate-300 shadow-xl group-hover/tooltip:block">
                      Safety stop only. Exits are managed dynamically based on continuously updated altcoin analysis.
                    </div>
                  </div>
                )}
              </div>
              <p
                className={`mt-1 truncate font-medium ${
                  isMaeNegative
                    ? 'text-red-400'
                    : 'text-slate-100'
                }`}
              >
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </article>
  );
}