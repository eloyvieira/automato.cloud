export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validators';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid data' },
      { status: 400 },
    );
  }

  // E-mail delivery is not wired up yet: the message is persisted so it can be
  // sent (or reviewed) later.
  await prisma.message.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
