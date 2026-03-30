import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'needmoneyforporsche';

export function requireAdmin(): NextResponse | null {
  const auth = headers().get('x-admin-token');
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  return null;
}
