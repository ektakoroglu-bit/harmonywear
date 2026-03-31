import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getUserByEmail, createPasswordResetToken } from '@/lib/db/userService';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'missingEmail' }, { status: 400 });

    const user = await getUserByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true });

    const token = randomBytes(32).toString('hex');
    const saved = await createPasswordResetToken(user.id, token);
    if (!saved) return NextResponse.json({ error: 'serverError' }, { status: 500 });

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const resetLink = `${base}/tr/account/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[auth/forgot-password]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
