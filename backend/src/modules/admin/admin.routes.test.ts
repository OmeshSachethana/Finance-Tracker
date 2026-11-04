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

describe('PATCH /api/admin/users/:id/role', () => {
  it('promotes a user to admin', async () => {
    const { userId } = await authHeader(app);
    const admin = await adminHeader(app);
    const res = await request(app)
      .patch(`/api/admin/users/${userId}/role`)
      .set(admin)
      .send({ role: 'admin' });
    expect(res.body.user.role).toBe('admin');
  });

  it('prevents admins from demoting themselves', async () => {
    const admin = await adminHeader(app);
    const res = await request(app)
      .patch(`/api/admin/users/${admin.userId}/role`)
      .set({ Authorization: admin.Authorization })
      .send({ role: 'user' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/admin/users/:id', () => {
  it('deletes another user', async () => {
    const { userId } = await authHeader(app);
    const admin = await adminHeader(app);
    await request(app).delete(`/api/admin/users/${userId}`).set(admin).expect(204);
    const res = await request(app).get('/api/admin/stats').set(admin);
    expect(res.body.users).toBe(1);
  });
});
