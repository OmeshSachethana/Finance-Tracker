import type { User } from '../../generated/prisma/client.ts';
import { env } from '../../config/env.ts';
import { prisma } from '../../lib/prisma.ts';
import { unauthorized } from '../../lib/errors.ts';
import { createRefreshToken, hashRefreshToken, signAccessToken } from '../../lib/tokens.ts';

export interface Session {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

/** Issues a new access token and a stored refresh token for the user. */
export async function createSession(user: Pick<User, 'id' | 'role'>): Promise<Session> {
  const { token, hash } = createRefreshToken();
  const refreshExpiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash: hash, userId: user.id, expiresAt: refreshExpiresAt },
  });

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  return { accessToken, refreshToken: token, refreshExpiresAt };
}

/** Exchanges a valid refresh token for a new session, revoking the old token. */
export async function rotateSession(refreshToken: string): Promise<Session> {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashRefreshToken(refreshToken) },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw unauthorized('Session expired, please log in again');
  }

  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  return createSession(stored.user);
}
