export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBtcRegime } from '@/services/market.service';
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

  const regime = await getBtcRegime();
  return NextResponse.json({ regime });
}
