import { supabaseAdmin as supabase } from '@/lib/supabaseServer';
import type { User, SavedAddress, PointsTransaction, RegisterData } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DbUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  password_hash: string;
  points: number;
  created_at: string;
};

type DbAddress = {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  district: string | null;
  zip_code: string | null;
  country: string;
  is_default: boolean;
};

// ─── Mappers ──────────────────────────────────────────────────────────────────

function toUser(row: DbUser, addresses: SavedAddress[] = []): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? undefined,
    passwordHash: row.password_hash,
    points: row.points,
    addresses,
    pointsHistory: [],
    createdAt: row.created_at,
  };
}

function toAddress(row: DbAddress): SavedAddress {
  return {
    id: row.id,
    label: row.label,
    firstName: row.first_name,
    lastName: row.last_name,
    address: row.address,
    city: row.city,
    district: row.district ?? undefined,
    zipCode: row.zip_code ?? undefined,
    country: row.country,
    isDefault: row.is_default,
  };
}

// ─── User CRUD ────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data: userRow, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !userRow) return null;

  const addresses = await getAddressesByUserId(userRow.id);
  return toUser(userRow as DbUser, addresses);
}

export async function getUserById(id: string): Promise<User | null> {
  const { data: userRow, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !userRow) return null;

  const addresses = await getAddressesByUserId(id);
  return toUser(userRow as DbUser, addresses);
}

export async function createUser(
  data: RegisterData & { passwordHash: string }
): Promise<User | null> {
  const { data: userRow, error } = await supabase
    .from('users')
    .insert({
      email: data.email.toLowerCase(),
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone ?? null,
      password_hash: data.passwordHash,
    })
    .select()
    .single();

  if (error || !userRow) return null;
  return toUser(userRow as DbUser);
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({
      ...(updates.firstName !== undefined && { first_name: updates.firstName }),
      ...(updates.lastName !== undefined && { last_name: updates.lastName }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
    })
    .eq('id', id);

  return !error;
}

export async function updatePasswordHash(id: string, passwordHash: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', id);

  return !error;
}

export async function updatePoints(id: string, points: number): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ points })
    .eq('id', id);

  return !error;
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function getAddressesByUserId(userId: string): Promise<SavedAddress[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error || !data) return [];
  return (data as DbAddress[]).map(toAddress);
}

export async function addAddress(
  userId: string,
  address: Omit<SavedAddress, 'id'>
): Promise<SavedAddress | null> {
  // If new address is default, clear other defaults first
  if (address.isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      label: address.label,
      first_name: address.firstName,
      last_name: address.lastName,
      address: address.address,
      city: address.city,
      district: address.district ?? null,
      zip_code: address.zipCode ?? null,
      country: address.country,
      is_default: address.isDefault ?? false,
    })
    .select()
    .single();

  if (error || !data) return null;
  return toAddress(data as DbAddress);
}

export async function removeAddress(addressId: string): Promise<boolean> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  return !error;
}

// ─── Points history ───────────────────────────────────────────────────────────

export async function getPointsHistory(userId: string): Promise<PointsTransaction[]> {
  const { data, error } = await supabase
    .from('points_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    type: row.type as PointsTransaction['type'],
    amount: row.amount,
    reason: row.reason as PointsTransaction['reason'],
    description: row.description,
    orderId: row.order_id ?? undefined,
    createdAt: row.created_at,
  }));
}

// ─── Password reset tokens ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: string, token: string): Promise<boolean> {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  // Invalidate previous unused tokens for this user
  await supabase.from('password_reset_tokens').update({ used: true }).eq('user_id', userId).eq('used', false);
  const { error } = await supabase.from('password_reset_tokens').insert({ user_id: userId, token, expires_at: expiresAt });
  return !error;
}

export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('user_id, expires_at, used')
    .eq('token', token)
    .single();

  if (error || !data || data.used || new Date(data.expires_at) < new Date()) return null;

  await supabase.from('password_reset_tokens').update({ used: true }).eq('token', token);
  return data.user_id;
}

export async function addPointsTransaction(
  userId: string,
  tx: Omit<PointsTransaction, 'id' | 'createdAt'>
): Promise<boolean> {
  const { error } = await supabase
    .from('points_transactions')
    .insert({
      user_id: userId,
      type: tx.type,
      amount: tx.amount,
      reason: tx.reason,
      description: tx.description,
      order_id: tx.orderId ?? null,
    });

  return !error;
}
