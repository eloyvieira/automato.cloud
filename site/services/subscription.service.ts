import { prisma } from '../lib/prisma';
import { hasPremiumAccess, hasApiAccess } from '../lib/permissions';

export { hasPremiumAccess, hasApiAccess };

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId: BigInt(userId) },
    include: { plan: true },
  });
}
