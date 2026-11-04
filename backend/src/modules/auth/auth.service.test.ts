import { resetDatabase } from '../../test/db.ts';
import { loginUser, registerUser } from './auth.service.ts';

const input = { name: 'Jane', email: 'jane@example.com', password: 'Secret123' };

beforeEach(resetDatabase);

describe('registerUser', () => {
  it('creates a user with a hashed password', async () => {
    const user = await registerUser(input);
    expect(user.email).toBe('jane@example.com');
    expect(user.passwordHash).not.toBe('Secret123');
  });

  it('rejects duplicate emails', async () => {
    await registerUser(input);
    await expect(registerUser(input)).rejects.toMatchObject({ status: 409 });
  });
});

describe('loginUser', () => {
  it('returns the user for correct credentials', async () => {
    await registerUser(input);
    const user = await loginUser({ email: input.email, password: input.password });
    expect(user.name).toBe('Jane');
  });

  it('rejects a wrong password', async () => {
    await registerUser(input);
    await expect(loginUser({ email: input.email, password: 'Wrong1234' })).rejects.toMatchObject({
      status: 401,
    });
  });

  it('rejects an unknown email', async () => {
    await expect(loginUser({ email: 'no@example.com', password: 'x' })).rejects.toMatchObject({
      status: 401,
    });
  });
});
