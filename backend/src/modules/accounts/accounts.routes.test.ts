import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';

const app = createApp();

beforeEach(resetDatabase);

describe('GET /api/accounts', () => {
  it('returns the default cash account with zero balance', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app).get('/api/accounts').set({ Authorization });
    expect(res.body.items).toEqual([
      expect.objectContaining({ name: 'Cash', type: 'cash', balance: 0 }),
    ]);
  });
});

describe('POST /api/accounts', () => {
  it('creates an account with its opening balance', async () => {
    const { Authorization } = await authHeader(app);
    const res = await request(app).post('/api/accounts').set({ Authorization }).send({
      name: 'Main Bank',
      type: 'bank',
      currency: 'USD',
      openingBalance: 250000,
      color: '#3b82f6',
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Main Bank', balance: 250000, archived: false });
  });
});

describe('PATCH /api/accounts/:id', () => {
  it('archives an account', async () => {
    const { Authorization } = await authHeader(app);
    const list = await request(app).get('/api/accounts').set({ Authorization });
    const res = await request(app)
      .patch(`/api/accounts/${list.body.items[0].id}`)
      .set({ Authorization })
      .send({ archived: true });
    expect(res.body.archived).toBe(true);
  });

  it("cannot edit another user's account", async () => {
    const owner = await authHeader(app);
    const other = await authHeader(app);
    const list = await request(app)
      .get('/api/accounts')
      .set({ Authorization: owner.Authorization });
    const res = await request(app)
      .patch(`/api/accounts/${list.body.items[0].id}`)
      .set({ Authorization: other.Authorization })
      .send({ name: 'Mine now' });
    expect(res.status).toBe(404);
  });
});

describe('account balances', () => {
  it('reflects income and expenses', async () => {
    const { headers, accountId, groceriesId, salaryId } = await userWithDefaults(app);
    const base = { date: '2026-10-01', accountId };
    await request(app)
      .post('/api/transactions')
      .set(headers)
      .send({ ...base, type: 'income', amount: 10000, description: 'Pay', categoryId: salaryId });
    await request(app)
      .post('/api/transactions')
      .set(headers)
      .send({
        ...base,
        type: 'expense',
        amount: 2500,
        description: 'Food',
        categoryId: groceriesId,
      });
    const res = await request(app).get('/api/accounts').set(headers);
    expect(res.body.items[0].balance).toBe(7500);
  });
});
