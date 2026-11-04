import express from 'express';
import request from 'supertest';
import { signAccessToken } from '../lib/tokens.ts';
import { authenticate } from './authenticate.ts';
import { errorHandler } from './errorHandler.ts';
import { requireRole } from './requireRole.ts';

function buildApp() {
  const app = express();
  app.get('/me', authenticate, (req, res) => {
    res.json(req.user);
  });
  app.get('/admin', authenticate, requireRole('ADMIN'), (_req, res) => {
    res.json({ ok: true });
  });
  app.use(errorHandler);
  return app;
}

describe('authenticate', () => {
  it('rejects requests without a token', async () => {
    const res = await request(buildApp()).get('/me');
    expect(res.status).toBe(401);
  });

  it('rejects invalid tokens', async () => {
    const res = await request(buildApp()).get('/me').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(401);
  });

  it('attaches the user for valid tokens', async () => {
    const token = await signAccessToken({ sub: 'u1', role: 'USER' });
    const res = await request(buildApp()).get('/me').set('Authorization', `Bearer ${token}`);
    expect(res.body).toEqual({ sub: 'u1', role: 'USER' });
  });
});

describe('requireRole', () => {
  it('blocks users without the role', async () => {
    const token = await signAccessToken({ sub: 'u1', role: 'USER' });
    const res = await request(buildApp()).get('/admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows users with the role', async () => {
    const token = await signAccessToken({ sub: 'u1', role: 'ADMIN' });
    const res = await request(buildApp()).get('/admin').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
