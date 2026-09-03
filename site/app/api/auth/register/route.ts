export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { REFERRAL_COOKIE } from '@/lib/referral';
import { getOrCreateReferralCode, resolveReferrerId } from '@/services/referral.service';
import { registerSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // The referral code only ever comes from the httpOnly cookie set by the
    // proxy, and is resolved to a referrer on the server.
    const cookieStore = await cookies();
    const referralCode = cookieStore.get(REFERRAL_COOKIE)?.value ?? null;
    const referredById = await resolveReferrerId(referralCode);

    const hashed = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
        referredById,
      },
    });

    // Every account gets its own referral code right away.
    await getOrCreateReferralCode(user.id.toString());

    await createSession({ userId: user.id.toString(), email: user.email });

    // The code is now stored on the account; the cookie is no longer needed.
    if (referralCode) cookieStore.delete(REFERRAL_COOKIE);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Registration failed' }, { status: 400 });
  }
}
