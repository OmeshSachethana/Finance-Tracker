import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('budgets', () => {
  it('creates a budget and reports spending against it', async () => {
    const { headers, accountId, groceriesId } = await userWithDefaults(app);
    await request(app)
      .post('/api/budgets')
      .set(headers)
      .send({ categoryId: groceriesId, month: '2026-11', limit: 40000 })
      .expect(201);
    await request(app).post('/api/transactions').set(headers).send({
      type: 'expense',
      amount: 34000,
      date: '2026-11-03',
      description: 'Big shop',
      categoryId: groceriesId,
      accountId,
    });

    const res = await request(app).get('/api/budgets?month=2026-11').set(headers);
    expect(res.body.items[0]).toMatchObject({
      limit: 40000,
      spent: 34000,
      remaining: 6000,
      percent: 85,
      status: 'warning',
    });
  });

  it('rejects a second budget for the same category and month', async () => {
    const { headers, groceriesId } = await userWithDefaults(app);
    const body = { categoryId: groceriesId, month: '2026-11', limit: 40000 };
    await request(app).post('/api/budgets').set(headers).send(body);
    const res = await request(app).post('/api/budgets').set(headers).send(body);
    expect(res.status).toBe(409);
  });

  it('rejects budgets on income categories', async () => {
    const { headers, salaryId } = await userWithDefaults(app);
    const res = await request(app)
      .post('/api/budgets')
      .set(headers)
      .send({ categoryId: salaryId, month: '2026-11', limit: 100 });
    expect(res.status).toBe(400);
  });

  it('updates the limit', async () => {
    const { headers, groceriesId } = await userWithDefaults(app);
    const created = await request(app)
      .post('/api/budgets')
      .set(headers)
      .send({ categoryId: groceriesId, month: '2026-11', limit: 40000 });
    const res = await request(app)
      .patch(`/api/budgets/${created.body.id}`)
      .set(headers)
      .send({ limit: 50000, alertThreshold: 90 });
    expect(res.body).toMatchObject({ limit: 50000, alertThreshold: 90 });
  });
});
