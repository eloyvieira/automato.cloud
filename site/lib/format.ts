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

/**
 * Human label for each regime code. Edit here to change the wording used
 * across the whole app (hero badges, methodology table, rankings).
 */
const REGIME_LABEL: Record<RegimeCode, string> = {
  LONG_STRONG: 'Strong Bullish',
  LONG_WEAK: 'Bullish regime with lower conviction',
  NEUTRAL: 'No Confirmed Direction',
  SHORT_WEAK: 'Bearish regime with lower conviction',
  SHORT_STRONG: 'Strong Bearish',
};

/** Maps a regime code to its human label. */
export function regimeLabel(regime: RegimeCode | string | null): string {
  if (regime && regime in REGIME_LABEL) return REGIME_LABEL[regime as RegimeCode];

  // Unknown/missing code: fall back to the tone so the UI never shows a blank.
  const tone = regimeTone(regime);
  if (tone === 'long') return 'Bullish';
  if (tone === 'short') return 'Bearish';
  return 'Neutral';
}

/**
 * Valor numérico de cada regime, usado para desenhar a curvatura do gráfico:
 * acima de zero = alta, zero = horizontal (neutro), abaixo de zero = baixa.
 */
export const REGIME_SCORE: Record<RegimeCode, number> = {
  LONG_STRONG: 2,
  LONG_WEAK: 1,
  NEUTRAL: 0,
  SHORT_WEAK: -1,
  SHORT_STRONG: -2,
};

export const REGIME_SCORE_MIN = -2;
export const REGIME_SCORE_MAX = 2;

/** Regime -> número. Códigos desconhecidos caem no tom (alta/baixa/neutro). */
export function regimeScore(regime: RegimeCode | string | null): number {
  if (regime && regime in REGIME_SCORE) return REGIME_SCORE[regime as RegimeCode];

  const tone = regimeTone(regime);
  if (tone === 'long') return REGIME_SCORE.LONG_WEAK;
  if (tone === 'short') return REGIME_SCORE.SHORT_WEAK;
  return REGIME_SCORE.NEUTRAL;
}

/** Número -> regime, para rotular o eixo Y do gráfico. */
export function regimeByScore(score: number): RegimeCode | null {
  const found = Object.entries(REGIME_SCORE).find(([, value]) => value === score);
  return found ? (found[0] as RegimeCode) : null;
}

/** Hora "HH:MM" de um timestamp, calculada no servidor. */
export function formatClock(timestamp: string | Date | null | undefined): string {
  if (!timestamp) return '--';

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '--';

  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
