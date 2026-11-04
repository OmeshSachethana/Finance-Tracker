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

describe('POST /api/users/me/password', () => {
  it('changes the password', async () => {
    const { Authorization } = await authHeader(app);
    const me = await request(app).get('/api/auth/me').set({ Authorization });
    await request(app)
      .post('/api/users/me/password')
      .set({ Authorization })
      .send({ currentPassword: 'Secret123', newPassword: 'NewSecret456' })
      .expect(204);
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: me.body.user.email, password: 'NewSecret456' });
    expect(login.status).toBe(200);
  });

  it('requires the current password', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app)
      .post('/api/users/me/password')
      .set({ Authorization })
      .send({ currentPassword: 'Wrong1234', newPassword: 'NewSecret456' });
    expect(res.status).toBe(400);
  });
});
