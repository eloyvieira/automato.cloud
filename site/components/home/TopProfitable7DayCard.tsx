import type { ProfitSignal } from '@/lib/home-types';
import { RegimeBadge } from './RegimeBadge';

export function TopProfitable7DayCard({
  signals,
  delayed,
}: {
  signals: ProfitSignal[];
  delayed: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            7 day view
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Top 10 Signals by MFE</h2>
        </div>
        {delayed && (
          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500">
            15 min delay
          </span>
        )}
      </div>

      <div className="mt-6 w-full">
        <div
          className="grid w-full items-center gap-3 border-b border-white/[0.08] pb-2 text-[11px] uppercase tracking-wider text-slate-500"
          style={{
            gridTemplateColumns: '0.8fr 1.8fr 1.4fr 0.7fr 0.8fr',
          }}
        >
          <span>MFE</span>
          <span>Symbol</span>
          <span>Regime</span>
          <span>Strategy</span>
          <span>Timeframe</span>
        </div>

        {signals.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">
            No signals in the last 7 days.
          </p>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className="grid w-full items-center gap-3 border-b border-white/[0.04] py-3 text-xs last:border-0"
              style={{
                gridTemplateColumns: '0.8fr 1.8fr 1.4fr 0.7fr 0.8fr',
              }}
            >
              <span
                className={
                  signal.mfe.startsWith('-')
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }
              >
                {signal.mfe}
              </span>
              <span className="font-medium text-slate-200">
                {signal.symbol}
              </span>

              <RegimeBadge tone={signal.direction}>
                {signal.regime}
              </RegimeBadge>

              <span className="text-slate-300">
                {signal.strategy}
              </span>

              <span className="text-slate-300">
                {signal.timeframe}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
