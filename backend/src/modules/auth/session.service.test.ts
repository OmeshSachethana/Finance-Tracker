import { prisma } from '../../lib/prisma.ts';
import { verifyAccessToken } from '../../lib/tokens.ts';
import { resetDatabase } from '../../test/db.ts';
import { registerUser } from './auth.service.ts';
import { createSession, revokeSession, rotateSession } from './session.service.ts';

async function makeUser() {
  return registerUser({ name: 'Jane', email: 'jane@example.com', password: 'Secret123' });
}

beforeEach(resetDatabase);

describe('createSession', () => {
  it('returns a valid access token for the user', async () => {
    const user = await makeUser();
    const session = await createSession(user);
    expect((await verifyAccessToken(session.accessToken)).sub).toBe(user.id);
  });

  it('stores only the hash of the refresh token', async () => {
    const user = await makeUser();
    const session = await createSession(user);
    const stored = await prisma.refreshToken.findFirstOrThrow();
    expect(stored.tokenHash).not.toBe(session.refreshToken);
  });
});

describe('rotateSession', () => {
  it('issues a new refresh token and revokes the old one', async () => {
    const user = await makeUser();
    const first = await createSession(user);
    const second = await rotateSession(first.refreshToken);
    expect(second.refreshToken).not.toBe(first.refreshToken);
    await expect(rotateSession(first.refreshToken)).rejects.toMatchObject({ status: 401 });
  });

  it('rejects unknown tokens', async () => {
    await expect(rotateSession('not-a-token')).rejects.toMatchObject({ status: 401 });
  });

  it('rejects expired tokens', async () => {
    const user = await makeUser();
    const session = await createSession(user);
    await prisma.refreshToken.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });
    await expect(rotateSession(session.refreshToken)).rejects.toMatchObject({ status: 401 });
  });
});

describe('revokeSession', () => {
  it('prevents the token from being used again', async () => {
    const user = await makeUser();
    const session = await createSession(user);
    await revokeSession(session.refreshToken);
    await expect(rotateSession(session.refreshToken)).rejects.toMatchObject({ status: 401 });
  });
});
