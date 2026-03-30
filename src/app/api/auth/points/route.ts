import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { getUserById, updatePoints, addPointsTransaction } from '@/lib/db/userService';
import type { PointsTransaction } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const userId = getSessionUserId();
    if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { amount, reason, description, orderId, action } = await req.json();

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: 'notFound' }, { status: 404 });

    if (action === 'redeem') {
      const { requiredPoints, discountValue } = await req.json().catch(() => ({ requiredPoints: 0, discountValue: 0 }));
      if ((user.points ?? 0) < requiredPoints) {
        return NextResponse.json({ error: 'insufficientPoints' }, { status: 400 });
      }
      const code = `PUAN-${discountValue}-${Date.now().toString(36).toUpperCase()}`;
      const tx: Omit<PointsTransaction, 'id' | 'createdAt'> = {
        type: 'spent',
        amount: requiredPoints,
        reason: 'redeemed',
        description: `${discountValue}₺ indirim kodu: ${code}`,
        orderId: undefined,
      };
      await updatePoints(userId, (user.points ?? 0) - requiredPoints);
      await addPointsTransaction(userId, tx);
      return NextResponse.json({ code });
    }

    // Regular addPoints
    const tx: Omit<PointsTransaction, 'id' | 'createdAt'> = {
      type: amount >= 0 ? 'earned' : 'spent',
      amount: Math.abs(amount),
      reason,
      description,
      orderId,
    };
    const newPoints = Math.max(0, (user.points ?? 0) + amount);
    await updatePoints(userId, newPoints);
    await addPointsTransaction(userId, tx);

    const updated = await getUserById(userId);
    const { passwordHash: _, ...safeUser } = updated as typeof updated & { passwordHash?: string };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('[auth/points]', err);
    return NextResponse.json({ error: 'serverError' }, { status: 500 });
  }
}
