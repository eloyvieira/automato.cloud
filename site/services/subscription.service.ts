import { prisma } from '../lib/prisma';
import { getAccessPolicy, getUserAccessTier, hasPremiumAccess, hasApiAccess } from '../lib/permissions';

export { getAccessPolicy, getUserAccessTier, hasPremiumAccess, hasApiAccess };

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId: BigInt(userId) },
    include: { plan: true },
  });
}
