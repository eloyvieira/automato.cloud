import type { RankingKind } from './home-types';

export type AccessTier = 'free' | 'premium_weekly';

export type AccessPolicy = {
  tier: AccessTier;
  premium: boolean;
  apiAccess: boolean;
  signalDelayMinutes: number;
  signalListLimit: number | null;
  signalCardLimit: number;
  sevenDayLimit: number;
  rankingDelayMinutes: number;
  rankingLimit: number | null;
  rankingKinds: readonly RankingKind[];
};

const FREE_RANKING_KINDS: readonly RankingKind[] = [
  'top-mfe',
  'most-profitable',
  'best-long',
  'best-short',
];

const ALL_RANKING_KINDS: readonly RankingKind[] = [
  'top-mfe',
  'most-profitable',
  'best-long',
  'best-short',
  'best-scalping',
  'best-day',
  'best-swing',
];

export const ACCESS_POLICIES: Record<AccessTier, AccessPolicy> = {
  free: {
    tier: 'free',
    premium: false,
    apiAccess: false,
    signalDelayMinutes: 15,
    signalListLimit: 5,
    signalCardLimit: 3,
    sevenDayLimit: 10,
    rankingDelayMinutes: 15,
    rankingLimit: 20,
    rankingKinds: FREE_RANKING_KINDS,
  },
  premium_weekly: {
    tier: 'premium_weekly',
    premium: true,
    apiAccess: true,
    signalDelayMinutes: 0,
    signalListLimit: null,
    signalCardLimit: 9,
    sevenDayLimit: 10,
    rankingDelayMinutes: 0,
    rankingLimit: null,
    rankingKinds: ALL_RANKING_KINDS,
  },
};

export function cutoffDate(delayMinutes: number, now = Date.now()): Date | null {
  if (delayMinutes <= 0) return null;
  return new Date(now - delayMinutes * 60_000);
}

export function isRankingAllowed(policy: AccessPolicy, kind: RankingKind): boolean {
  return policy.rankingKinds.includes(kind);
}
