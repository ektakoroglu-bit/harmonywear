import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { getUserByEmail, getPointsHistory } from '@/lib/db/userService';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'missingFields' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'notFound' }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash ?? '')) {
      return NextResponse.json({ error: 'invalidPassword' }, { status: 401 });
    }

    const pointsHistory = await getPointsHistory(user.id);
    setSessionCookie(user.id);

    const { passwordHash: _, ...safeUser } = { ...user, pointsHistory };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
