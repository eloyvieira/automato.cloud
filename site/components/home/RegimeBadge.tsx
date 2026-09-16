import type { Direction } from '@/lib/home-types';

export function RegimeBadge({
  children,
  tone = 'long',
}: {
  children: string;
  tone?: Direction | 'neutral';
}) {
  const toneClass =
    tone === 'short'
      ? 'border-red-500/20 bg-red-500/10 text-red-400'
      : tone === 'neutral'
        ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
        : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}
