import { prisma } from '../lib/prisma';
import { getBtcRegimeRows } from '../lib/home-data';
import { jsonSafe } from '../lib/serializer';

/** BTC regime rows (one per timeframe), cached in Redis for 5 minutes. */
export async function getBtcRegime() {
  return getBtcRegimeRows();
}

export async function getLastUpdate() {
  const latest = await prisma.marketRegime.findFirst({
    orderBy: { analyzedAt: 'desc' },
  });
  return latest ? jsonSafe(latest.analyzedAt) : null;
}
