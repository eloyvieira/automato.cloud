export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  // The user is always taken from the session, never from the request body.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid data' },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(session.userId) },
    select: { id: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  // Same hashing used by registration and login.
  const hashed = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, updatedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
