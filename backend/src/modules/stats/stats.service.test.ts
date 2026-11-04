import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';
import { getMonthlyTrend } from './stats.service.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('getMonthlyTrend', () => {
  it('includes empty months with zeros', async () => {
    const user = await userWithDefaults(app);
    await request(app).post('/api/transactions').set(user.headers).send({
      type: 'expense',
      amount: 1500,
      date: '2026-10-15',
      description: 'Lunch',
      categoryId: user.groceriesId,
      accountId: user.accountId,
    });
    const me = await request(app).get('/api/auth/me').set(user.headers);
    const trend = await getMonthlyTrend(me.body.user.id, 3, new Date(2026, 10, 4));
    expect(trend).toEqual([
      { month: '2026-09', income: 0, expense: 0 },
      { month: '2026-10', income: 0, expense: 1500 },
      { month: '2026-11', income: 0, expense: 0 },
    ]);
  });
});
