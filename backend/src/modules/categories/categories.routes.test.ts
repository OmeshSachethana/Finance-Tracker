import { DEFAULT_CATEGORIES } from '@finance-tracker/shared';
import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('GET /api/categories', () => {
  it('returns the default categories for a new user', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app).get('/api/categories').set({ Authorization });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(DEFAULT_CATEGORIES.length);
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/categories', () => {
  const body = { name: 'Pets', type: 'expense', color: '#f59e0b', icon: 'paw-print' };

  it('creates a category', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app).post('/api/categories').set({ Authorization }).send(body);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
  });

  it('rejects duplicate names regardless of case', async () => {
    const { Authorization } = await authHeader(app);
    await request(app).post('/api/categories').set({ Authorization }).send(body);
    const res = await request(app)
      .post('/api/categories')
      .set({ Authorization })
      .send({ ...body, name: 'PETS' });
    expect(res.status).toBe(409);
  });
});
