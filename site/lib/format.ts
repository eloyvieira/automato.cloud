import type { Direction, RegimeCode } from './home-types';

/**
 * Formats a price with a precision that suits its magnitude, so both
 * 3,642.18 and 0.00001123 stay readable.
 */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '--';

  const abs = Math.abs(value);
  const maximumFractionDigits = abs >= 1000 ? 2 : abs >= 1 ? 4 : abs >= 0.01 ? 5 : 8;

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  });
}

/** Turns a timestamp into a relative label such as "14 min ago". */
export function formatAge(
  timestamp: string | Date | null | undefined,
  now: number = Date.now(),
): string {
  if (!timestamp) return '--';

  const time = timestamp instanceof Date ? timestamp.getTime() : new Date(timestamp).getTime();
  if (!Number.isFinite(time)) return '--';

  const minutes = Math.max(0, Math.floor((now - time) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

/** Maps a regime code to the visual tone used across the page. */
export function regimeTone(regime: RegimeCode | string | null): Direction | 'neutral' {
  if (!regime) return 'neutral';
  if (regime.startsWith('LONG')) return 'long';
  if (regime.startsWith('SHORT')) return 'short';
  return 'neutral';
}

/** Maps a regime code to its human label. */
export function regimeLabel(regime: RegimeCode | string | null): string {
  const tone = regimeTone(regime);
  if (tone === 'long') return 'Bullish';
  if (tone === 'short') return 'Bearish';
  return 'Balanced';
}
