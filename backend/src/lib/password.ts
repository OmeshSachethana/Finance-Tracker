import bcrypt from 'bcryptjs';

const SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 4 : 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
