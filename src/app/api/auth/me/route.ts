import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, getPointsHistory } from '@/lib/db/userService';

export async function GET() {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: 'notFound' }, { status: 404 });

    const pointsHistory = await getPointsHistory(userId);
    const { passwordHash: _, ...safeUser } = { ...user, pointsHistory };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('[auth/me]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
