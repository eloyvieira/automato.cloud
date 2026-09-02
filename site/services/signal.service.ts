import { prisma } from '../lib/prisma';
import { getTopLongSignalRows, getTopShortSignalRows } from '../lib/home-data';
import { jsonSafe } from '../lib/serializer';

/** Top active LONG signals, cached in Redis for 5 minutes. */
export async function getTopLongSignals(limit = 5) {
  return getTopLongSignalRows(limit);
}

/** Top active SHORT signals, cached in Redis for 5 minutes. */
export async function getTopShortSignals(limit = 5) {
  return getTopShortSignalRows(limit);
}

export async function getSignalById(id: string) {
  const signal = await prisma.signal.findUnique({ where: { id: BigInt(id) } });
  return signal ? jsonSafe(signal) : null;
}
