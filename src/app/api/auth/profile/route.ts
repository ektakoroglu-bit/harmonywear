import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId, verifyPassword, hashPassword } from '@/lib/auth';
import { getUserById, updateUser, updatePasswordHash } from '@/lib/db/userService';

// PATCH /api/auth/profile — update name/phone
export async function PATCH(req: NextRequest) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const updates = await req.json();
    const ok = await updateUser(userId, updates);
    if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });

    const user = await getUserById(userId);
    const { passwordHash: _, ...safeUser } = user as typeof user & { passwordHash?: string };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('[auth/profile PATCH]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}

// POST /api/auth/profile/change-password
export async function POST(req: NextRequest) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'missingFields' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'passwordTooShort' }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: 'notFound' }, { status: 404 });

    if (!verifyPassword(currentPassword, user.passwordHash ?? '')) {
      return NextResponse.json({ error: 'invalidPassword' }, { status: 401 });
    }

    const ok = await updatePasswordHash(userId, hashPassword(newPassword));
    if (!ok) return NextResponse.json({ error: 'updateFailed' }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[auth/profile POST]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
