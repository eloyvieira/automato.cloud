import { prisma } from '../lib/prisma';
import { getProfitableCoinRows, getReliableCoinRows } from '../lib/home-data';

/** Markets ranked by average signal reliability over the last 7 days. */
export async function getMostReliableCoins(limit = 10) {
  return getReliableCoinRows(limit);
}

/** Markets ranked by average realized result of closed signals (last 7 days). */
export async function getMostProfitableCoins(limit = 10) {
  return getProfitableCoinRows(limit);
}

export async function getBestLong(limit = 10) {
  return prisma.signal.findMany({
    where: { status: 'active', direction: 'LONG' },
    orderBy: { reliability: 'desc' },
    take: limit,
  });
}

export async function getBestShort(limit = 10) {
  return prisma.signal.findMany({
    where: { status: 'active', direction: 'SHORT' },
    orderBy: { reliability: 'desc' },
    take: limit,
  });
}
