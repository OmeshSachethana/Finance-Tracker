import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';

const app = createApp();
const credentials = { name: 'Jane', email: 'jane@example.com', password: 'Secret123' };

function refreshCookie(res: request.Response): string {
  const cookies = res.headers['set-cookie'] as unknown as string[];
  return cookies.find((c) => c.startsWith('refresh_token='))!.split(';')[0]!;
}

beforeEach(resetDatabase);

describe('POST /api/auth/register', () => {
  it('creates a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('jane@example.com');
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it('sets an httpOnly refresh cookie', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);
    const cookie = (res.headers['set-cookie'] as unknown as string[])[0]!;
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Strict');
  });

  it('validates input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...credentials, password: 'weak' });
    expect(res.status).toBe(400);
    expect(res.body.error.details.password).toBeDefined();
  });

  it('rejects duplicate emails', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app).post('/api/auth/register').send(credentials);
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it('returns 401 for a wrong password', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'Wrong1234' });
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/refresh', () => {
  it('issues a new access token from the cookie', async () => {
    const reg = await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app).post('/api/auth/refresh').set('Cookie', refreshCookie(reg));
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
  });

  it('returns 401 without a cookie', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('revokes the refresh token', async () => {
    const reg = await request(app).post('/api/auth/register').send(credentials);
    const cookie = refreshCookie(reg);
    await request(app).post('/api/auth/logout').set('Cookie', cookie).expect(204);
    const res = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user', async () => {
    const reg = await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.accessToken}`);
    expect(res.body.user.name).toBe('Jane');
  });

  it('requires a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
