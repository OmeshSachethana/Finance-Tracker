import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

const app = createApp();

beforeEach(resetDatabase);

async function ruleFor(user: Awaited<ReturnType<typeof userWithDefaults>>, extra = {}) {
  return request(app)
    .post('/api/recurring')
    .set(user.headers)
    .send({
      type: 'expense',
      amount: 1299,
      description: 'Streaming subscription',
      categoryId: user.groceriesId,
      accountId: user.accountId,
      frequency: 'monthly',
      startDate: '2026-09-15',
      ...extra,
    });
}

describe('recurring rules', () => {
  it('creates a rule that first runs on its start date', async () => {
    const user = await userWithDefaults(app);
    const res = await ruleFor(user);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nextRunDate: '2026-09-15', active: true });
  });

  it('rejects an end date before the start date', async () => {
    const user = await userWithDefaults(app);
    const res = await ruleFor(user, { endDate: '2026-01-01' });
    expect(res.status).toBe(400);
  });
});
