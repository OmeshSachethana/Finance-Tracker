import type { Express } from 'express';
import request from 'supertest';
import { prisma } from '../lib/prisma.ts';
import { authHeader } from './auth.ts';

/** Registers a user, promotes them to admin and returns a fresh admin token header. */
export async function adminHeader(app: Express) {
  const { userId } = await authHeader(app);
  const user = await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'Secret123' });
  return { Authorization: `Bearer ${login.body.accessToken}`, userId };
}
