import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { setSessionCookie } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db/userService';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'missingFields' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'passwordTooShort' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'emailExists' }, { status: 409 });
    }

    const user = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password,
      passwordHash: hashPassword(password),
    });

    if (!user) {
      return NextResponse.json({ error: 'createFailed' }, { status: 500 });
    }

    setSessionCookie(user.id);

    const { passwordHash: _, ...safeUser } = user as typeof user & { passwordHash?: string };
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error('[auth/register]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
