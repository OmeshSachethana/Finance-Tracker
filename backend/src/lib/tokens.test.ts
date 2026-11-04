import {
  createRefreshToken,
  hashRefreshToken,
  signAccessToken,
  verifyAccessToken,
} from './tokens.ts';

describe('access tokens', () => {
  it('round-trips the user id and role', async () => {
    const token = await signAccessToken({ sub: 'user-1', role: 'ADMIN' });
    expect(await verifyAccessToken(token)).toEqual({ sub: 'user-1', role: 'ADMIN' });
  });

  it('rejects a tampered token', async () => {
    const token = await signAccessToken({ sub: 'user-1', role: 'USER' });
    await expect(verifyAccessToken(token.slice(0, -2) + 'xx')).rejects.toThrow();
  });
});

describe('refresh tokens', () => {
  it('returns a token and its matching hash', () => {
    const { token, hash } = createRefreshToken();
    expect(hashRefreshToken(token)).toBe(hash);
  });

  it('creates unique tokens', () => {
    expect(createRefreshToken().token).not.toBe(createRefreshToken().token);
  });
});
