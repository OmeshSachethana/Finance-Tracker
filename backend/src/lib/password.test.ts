import { hashPassword, verifyPassword } from './password.ts';

describe('password hashing', () => {
  it('verifies the original password', async () => {
    const hash = await hashPassword('Secret123');
    expect(await verifyPassword('Secret123', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('Secret123');
    expect(await verifyPassword('Wrong123', hash)).toBe(false);
  });

  it('does not store the plain password', async () => {
    const hash = await hashPassword('Secret123');
    expect(hash).not.toContain('Secret123');
  });
});
