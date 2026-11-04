import { loginSchema, passwordSchema, registerSchema } from './auth';

describe('passwordSchema', () => {
  it('accepts a strong password', () => {
    expect(passwordSchema.safeParse('Secret123').success).toBe(true);
  });

  it('rejects short passwords', () => {
    expect(passwordSchema.safeParse('Ab1').success).toBe(false);
  });

  it('requires a lowercase letter', () => {
    expect(passwordSchema.safeParse('SECRET123').success).toBe(false);
  });

  it('requires an uppercase letter', () => {
    expect(passwordSchema.safeParse('secret123').success).toBe(false);
  });

  it('requires a number', () => {
    expect(passwordSchema.safeParse('SecretPassword').success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('normalizes the email', () => {
    const result = loginSchema.parse({ email: '  Jane@Example.COM ', password: 'x' });
    expect(result.email).toBe('jane@example.com');
  });

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('requires a name', () => {
    const result = registerSchema.safeParse({
      name: '  ',
      email: 'jane@example.com',
      password: 'Secret123',
    });
    expect(result.success).toBe(false);
  });
});
