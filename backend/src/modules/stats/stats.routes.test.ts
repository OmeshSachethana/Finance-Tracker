import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

const app = createApp();

beforeEach(resetDatabase);

async function seed() {
  const user = await userWithDefaults(app);
  const add = (type: string, amount: number, date: string, categoryId: string) =>
    request(app)
      .post('/api/transactions')
      .set(user.headers)
      .send({ type, amount, date, description: 'x', categoryId, accountId: user.accountId });
  await add('income', 400000, '2026-10-01', user.salaryId);
  await add('expense', 50000, '2026-10-10', user.groceriesId);
  await add('expense', 30000, '2026-10-20', user.groceriesId);
  await add('expense', 20000, '2026-11-02', user.groceriesId);
  return user;
}

describe('GET /api/stats/summary', () => {
  it('summarizes the date range', async () => {
    const { headers } = await seed();
    const res = await request(app)
      .get('/api/stats/summary?from=2026-10-01&to=2026-10-31')
      .set(headers);
    expect(res.body).toEqual({
      income: 400000,
      expense: 80000,
      balance: 320000,
      savingsRate: 80,
      count: 3,
    });
  });

  it('rejects a reversed range', async () => {
    const { headers } = await seed();
    const res = await request(app)
      .get('/api/stats/summary?from=2026-10-31&to=2026-10-01')
      .set(headers);
    expect(res.status).toBe(400);
  });
});
