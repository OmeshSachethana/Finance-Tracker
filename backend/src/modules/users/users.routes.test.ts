import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('PATCH /api/users/me', () => {
  it('updates name and currency', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app)
      .patch('/api/users/me')
      .set({ Authorization })
      .send({ name: 'Jane Doe', currency: 'LKR' });
    expect(res.body.user).toMatchObject({ name: 'Jane Doe', currency: 'LKR' });
  });

  it('rejects unsupported currencies', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app)
      .patch('/api/users/me')
      .set({ Authorization })
      .send({ currency: 'ABC' });
    expect(res.status).toBe(400);
  });
});
