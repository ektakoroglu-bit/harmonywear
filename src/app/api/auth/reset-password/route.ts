import { NextRequest, NextResponse } from 'next/server';
import { consumePasswordResetToken, updatePasswordHash } from '@/lib/db/userService';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'missingFields' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'passwordTooShort' }, { status: 400 });
    }

    const userId = await consumePasswordResetToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'invalidOrExpiredToken' }, { status: 400 });
    }

    const ok = await updatePasswordHash(userId, hashPassword(password));
    if (!ok) return NextResponse.json({ error: 'serverError' }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[auth/reset-password]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
