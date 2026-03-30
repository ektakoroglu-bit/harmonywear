import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { addAddress, removeAddress, getUserById } from '@/lib/db/userService';

// POST /api/auth/address — add address
export async function POST(req: NextRequest) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const addressData = await req.json();
    const saved = await addAddress(userId, addressData);
    if (!saved) return NextResponse.json({ error: 'saveFailed' }, { status: 500 });

    const user = await getUserById(userId);
    const { passwordHash: _, ...safeUser } = user as typeof user & { passwordHash?: string };
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error('[auth/address POST]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}

// DELETE /api/auth/address — remove address
export async function DELETE(req: NextRequest) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { addressId } = await req.json();
    if (!addressId) return NextResponse.json({ error: 'missingId' }, { status: 400 });

    const ok = await removeAddress(addressId);
    if (!ok) return NextResponse.json({ error: 'deleteFailed' }, { status: 500 });

    const user = await getUserById(userId);
    const { passwordHash: _, ...safeUser } = user as typeof user & { passwordHash?: string };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('[auth/address DELETE]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
