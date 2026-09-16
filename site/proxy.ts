/**
 * Captures the referral code from any link shaped like `/?cpa=ABC123` and
 * stores it in a cookie, so the code is still available when the visitor
 * registers later. The code is only *validated* on the server at signup.
 *
 * `proxy.ts` is the Next.js 16 replacement for `middleware.ts`.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_QUERY_PARAM,
  normalizeReferralCode,
} from '@/lib/referral';

export function proxy(request: NextRequest) {
  const code = request.nextUrl.searchParams.get(REFERRAL_QUERY_PARAM);
  if (!code) return NextResponse.next();

  const normalized = normalizeReferralCode(code);
  if (!normalized) return NextResponse.next();

  const response = NextResponse.next();

  response.cookies.set(REFERRAL_COOKIE, normalized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}

export const config = {
  // Skip API routes and static assets: the referral link always lands on a page.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
