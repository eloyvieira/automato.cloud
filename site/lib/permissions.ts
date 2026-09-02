import { prisma } from './prisma';

export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId: BigInt(userId),
      status: 'active',
      plan: { type: 'premium' },
    },
  });
  return sub !== null;
}

export async function hasApiAccess(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId: BigInt(userId),
      status: 'active',
      plan: { type: 'api' },
    },
  });
  return sub !== null;
}
