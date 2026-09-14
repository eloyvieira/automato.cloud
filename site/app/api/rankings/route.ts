export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMostProfitableCoins, getMostReliableCoins } from '@/services/ranking.service';
import { getSession } from '@/lib/auth';
import { hasApiAccess } from '@/lib/permissions';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await hasApiAccess(session.userId))) {
    return NextResponse.json({ error: 'Premium Weekly required' }, { status: 403 });
  }

  const [rankings, profitable] = await Promise.all([
    getMostReliableCoins(20),
    getMostProfitableCoins(20),
  ]);

  return NextResponse.json({ rankings, profitable, realtime: true });
}
