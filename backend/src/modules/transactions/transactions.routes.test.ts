import request from 'supertest';
import { createApp } from '../../app.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('POST /api/transactions', () => {
  it('creates an expense', async () => {
    const { headers, accountId, groceriesId } = await userWithDefaults(app);
    const res = await request(app).post('/api/transactions').set(headers).send({
      type: 'expense',
      amount: 4599,
      date: '2026-11-04',
      description: 'Weekly shop',
      categoryId: groceriesId,
      accountId,
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ amount: 4599, date: '2026-11-04', tags: [] });
  });

  it('rejects a category of the wrong type', async () => {
    const { headers, accountId, salaryId } = await userWithDefaults(app);
    const res = await request(app).post('/api/transactions').set(headers).send({
      type: 'expense',
      amount: 100,
      date: '2026-11-04',
      description: 'Wrong',
      categoryId: salaryId,
      accountId,
    });
    expect(res.status).toBe(400);
  });
});
