export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getTopLongSignals, getTopShortSignals } from '@/services/signal.service';
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

  const [longSignals, shortSignals] = await Promise.all([
    getTopLongSignals(null, 0),
    getTopShortSignals(null, 0),
  ]);

  return NextResponse.json({
    long: longSignals,
    short: shortSignals,
    realtime: true,
  });
}
