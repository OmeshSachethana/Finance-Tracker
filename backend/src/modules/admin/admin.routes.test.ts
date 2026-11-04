import request from 'supertest';
import { createApp } from '../../app.ts';
import { adminHeader } from '../../test/admin.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('GET /api/admin/stats', () => {
  it('returns platform counts for admins', async () => {
    await authHeader(app);
    const admin = await adminHeader(app);
    const res = await request(app).get('/api/admin/stats').set(admin);
    expect(res.body).toMatchObject({ users: 2, newUsers: 2, transactions: 0 });
  });

  it('is forbidden for regular users', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app).get('/api/admin/stats').set({ Authorization });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/admin/users', () => {
  it('lists and searches users', async () => {
    await authHeader(app);
    const admin = await adminHeader(app);
    const all = await request(app).get('/api/admin/users').set(admin);
    expect(all.body.total).toBe(2);
    expect(all.body.items[0].passwordHash).toBeUndefined();
    const res = await request(app).get('/api/admin/users?search=user1').set(admin);
    expect(res.body.items.every((u: { email: string }) => u.email.includes('user1'))).toBe(true);
  });
});
