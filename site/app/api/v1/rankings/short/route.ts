export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBestShort } from '@/services/ranking.service';
import { getSession } from '@/lib/auth';
import { hasApiAccess } from '@/lib/permissions';
import { jsonSafe } from '@/lib/serializer';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiAccess = await hasApiAccess(session.userId);
  if (!apiAccess) {
    return NextResponse.json({ error: 'API access required' }, { status: 403 });
  }

  const signals = await getBestShort(20);
  return NextResponse.json({ signals: jsonSafe(signals) });
}
