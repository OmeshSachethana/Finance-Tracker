import request from 'supertest';
import type { Express } from 'express';

let counter = 0;

/** Registers a fresh user and returns an Authorization header for them. */
export async function authHeader(app: Express): Promise<{ Authorization: string; userId: string }> {
  counter += 1;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: `user${counter}@example.com`, password: 'Secret123' });
  return { Authorization: `Bearer ${res.body.accessToken}`, userId: res.body.user.id };
}
