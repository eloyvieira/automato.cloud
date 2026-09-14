import { prisma } from './prisma';
import { ACCESS_POLICIES, type AccessPolicy, type AccessTier } from './access-policy';

/**
 * Resolve the account tier once on the server.
 *
 * FREE = anonymous OR logged in without an active Premium Weekly subscription.
 * PREMIUM_WEEKLY = logged in with an active, non-expired premium-weekly subscription.
 *
 * The browser never decides this value.
 */
export async function getUserAccessTier(userId?: string | null): Promise<AccessTier> {
  if (!userId) return 'free';

  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      userId: BigInt(userId),
      status: 'active',
      startsAt: { lte: now },
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      plan: {
        isActive: true,
        slug: 'premium-weekly',
        type: 'premium',
      },
    },
    select: { id: true },
  });

  return sub ? 'premium_weekly' : 'free';
}

export async function getAccessPolicy(userId?: string | null): Promise<AccessPolicy> {
  const tier = await getUserAccessTier(userId);
  return ACCESS_POLICIES[tier];
}

export async function hasPremiumAccess(userId: string): Promise<boolean> {
  return (await getUserAccessTier(userId)) === 'premium_weekly';
}

/** Premium Weekly is the only paid tier, so it also grants API access. */
export async function hasApiAccess(userId: string): Promise<boolean> {
  return (await getUserAccessTier(userId)) === 'premium_weekly';
}
