import { DEFAULT_CATEGORIES } from '@finance-tracker/shared';
import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

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

describe('PATCH /api/categories/:id', () => {
  it('renames a category', async () => {
    const { Authorization } = await authHeader(app);
    const list = await request(app).get('/api/categories').set({ Authorization });
    const id = list.body.items[0].id;
    const res = await request(app)
      .patch(`/api/categories/${id}`)
      .set({ Authorization })
      .send({ name: 'Renamed' });
    expect(res.body.name).toBe('Renamed');
  });

  it("returns 404 for another user's category", async () => {
    const owner = await authHeader(app);
    const other = await authHeader(app);
    const list = await request(app)
      .get('/api/categories')
      .set({ Authorization: owner.Authorization });
    const res = await request(app)
      .patch(`/api/categories/${list.body.items[0].id}`)
      .set({ Authorization: other.Authorization })
      .send({ name: 'Hacked' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('deletes an unused category', async () => {
    const { Authorization } = await authHeader(app);
    const list = await request(app).get('/api/categories').set({ Authorization });
    const id = list.body.items[0].id;
    await request(app).delete(`/api/categories/${id}`).set({ Authorization }).expect(204);
    const after = await request(app).get('/api/categories').set({ Authorization });
    expect(after.body.items).toHaveLength(list.body.items.length - 1);
  });
});

describe('DELETE /api/categories/:id with transactions', () => {
  it('refuses to delete a category in use', async () => {
    const { headers, accountId, groceriesId } = await userWithDefaults(app);
    await request(app).post('/api/transactions').set(headers).send({
      type: 'expense',
      amount: 100,
      date: '2026-10-01',
      description: 'Milk',
      categoryId: groceriesId,
      accountId,
    });
    const res = await request(app).delete(`/api/categories/${groceriesId}`).set(headers);
    expect(res.status).toBe(409);
  });

  it('moves transactions to another category when asked', async () => {
    const { headers, accountId, groceriesId } = await userWithDefaults(app);
    const list = await request(app).get('/api/categories').set(headers);
    const food = list.body.items.find((c: { name: string }) => c.name === 'Food & Dining').id;
    await request(app).post('/api/transactions').set(headers).send({
      type: 'expense',
      amount: 100,
      date: '2026-10-01',
      description: 'Milk',
      categoryId: groceriesId,
      accountId,
    });
    await request(app)
      .delete(`/api/categories/${groceriesId}?reassignTo=${food}`)
      .set(headers)
      .expect(204);
    const txns = await request(app).get('/api/transactions').set(headers);
    expect(txns.body.items[0].categoryId).toBe(food);
  });
});
