import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'harmony_session';
const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production';

// ─── Password hashing ─────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
}

// ─── Session cookie ───────────────────────────────────────────────────────────

export function createSessionToken(userId: string): string {
  const ts = Date.now().toString();
  const sig = createHmac('sha256', SECRET).update(`${userId}:${ts}`).digest('hex');
  return Buffer.from(`${userId}:${ts}:${sig}`).toString('base64');
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length < 3) return null;
    const sig = parts.pop()!;
    const ts = parts.pop()!;
    const userId = parts.join(':'); // uuid may contain colons
    const expected = createHmac('sha256', SECRET).update(`${userId}:${ts}`).digest('hex');
    if (sig !== expected) return null;
    return userId;
  } catch {
    return null;
  }
}

export function setSessionCookie(userId: string) {
  const token = createSessionToken(userId);
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearSessionCookie() {
  cookies().set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
}

export function getSessionUserId(): string | null {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
