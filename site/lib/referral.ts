/**
 * Referral program constants and pure helpers.
 *
 * This module must stay free of Prisma/Redis imports: `proxy.ts` imports it,
 * and everything a Proxy pulls in is bundled with it. Database-backed helpers
 * live in `services/referral.service.ts`.
 */
import { getAppUrl } from './app-url';

/** Cookie that carries the referral code from the landing page to signup. */
export const REFERRAL_COOKIE = 'automato_cpa';

/** Query string parameter of the referral link: /?cpa=ABC123 */
export const REFERRAL_QUERY_PARAM = 'cpa';

/** The cookie survives long enough for the visitor to come back and register. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const REFERRAL_CODE_LENGTH = 6;

/** Commission paid to the referrer: 10% of every Premium payment. */
export const REFERRAL_COMMISSION_RATE = 0.1;

/** Currency the commission balance is kept in. */
export const REFERRAL_COMMISSION_CURRENCY = 'USDT';

/**
 * Letters and numbers only. `I`, `O`, `0` and `1` are left out so a code is
 * never mistyped when copied by hand.
 */
export const REFERRAL_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const CODE_PATTERN = /^[A-Z0-9]{6}$/;

/** A referral code has exactly 6 alphanumeric characters (ABC123). */
export function isValidReferralCodeFormat(code: string): boolean {
  return CODE_PATTERN.test(code);
}

/** Normalizes user/URL input before comparing it with a stored code. */
export function normalizeReferralCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return isValidReferralCodeFormat(normalized) ? normalized : null;
}

/** Absolute referral link for a code: https://domain.com/?cpa=ABC123 */
export function buildReferralLink(code: string): string {
  return `${getAppUrl()}/?${REFERRAL_QUERY_PARAM}=${code}`;
}
