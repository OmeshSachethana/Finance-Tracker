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

async function seed(count: number) {
  const user = await userWithDefaults(app);
  for (let i = 1; i <= count; i++) {
    await request(app)
      .post('/api/transactions')
      .set(user.headers)
      .send({
        type: i % 3 === 0 ? 'income' : 'expense',
        amount: i * 1000,
        date: `2026-10-${String(i).padStart(2, '0')}`,
        description: i % 2 === 0 ? `Coffee ${i}` : `Lunch ${i}`,
        categoryId: i % 3 === 0 ? user.salaryId : user.groceriesId,
        accountId: user.accountId,
      });
  }
  return user;
}

describe('GET /api/transactions', () => {
  it('returns newest first with pagination info', async () => {
    const { headers } = await seed(5);
    const res = await request(app).get('/api/transactions?pageSize=2').set(headers);
    expect(res.body.total).toBe(5);
    expect(res.body.totalPages).toBe(3);
    expect(res.body.items.map((t: { date: string }) => t.date)).toEqual([
      '2026-10-05',
      '2026-10-04',
    ]);
  });

  it('returns the requested page', async () => {
    const { headers } = await seed(5);
    const res = await request(app).get('/api/transactions?pageSize=2&page=3').set(headers);
    expect(res.body.items).toHaveLength(1);
  });

  it("does not include other users' transactions", async () => {
    await seed(3);
    const other = await userWithDefaults(app);
    const res = await request(app).get('/api/transactions').set(other.headers);
    expect(res.body.total).toBe(0);
  });
});

describe('GET /api/transactions filters', () => {
  it('filters by type', async () => {
    const { headers } = await seed(6);
    const res = await request(app).get('/api/transactions?type=income').set(headers);
    expect(res.body.total).toBe(2);
  });

  it('filters by category', async () => {
    const { headers, salaryId } = await seed(6);
    const res = await request(app).get(`/api/transactions?categoryId=${salaryId}`).set(headers);
    expect(res.body.total).toBe(2);
  });

  it('filters by account', async () => {
    const { headers, accountId } = await seed(3);
    const res = await request(app).get(`/api/transactions?accountId=${accountId}`).set(headers);
    expect(res.body.total).toBe(3);
  });

  it('filters by date range inclusively', async () => {
    const { headers } = await seed(6);
    const res = await request(app)
      .get('/api/transactions?from=2026-10-02&to=2026-10-04')
      .set(headers);
    expect(res.body.total).toBe(3);
  });

  it('searches descriptions case-insensitively', async () => {
    const { headers } = await seed(6);
    const res = await request(app).get('/api/transactions?search=coffee').set(headers);
    expect(res.body.total).toBe(3);
  });

  it('filters by tag', async () => {
    const { headers, accountId, groceriesId } = await userWithDefaults(app);
    await request(app)
      .post('/api/transactions')
      .set(headers)
      .send({
        type: 'expense',
        amount: 500,
        date: '2026-10-01',
        description: 'Snacks',
        tags: ['trip'],
        categoryId: groceriesId,
        accountId,
      });
    const res = await request(app).get('/api/transactions?tag=trip').set(headers);
    expect(res.body.total).toBe(1);
  });
});

describe('GET /api/transactions sorting', () => {
  it('sorts by amount ascending', async () => {
    const { headers } = await seed(3);
    const res = await request(app).get('/api/transactions?sortBy=amount&order=asc').set(headers);
    expect(res.body.items.map((t: { amount: number }) => t.amount)).toEqual([1000, 2000, 3000]);
  });

  it('rejects unknown sort fields', async () => {
    const { headers } = await seed(1);
    const res = await request(app).get('/api/transactions?sortBy=userId').set(headers);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/transactions/:id', () => {
  it('returns a single transaction', async () => {
    const { headers } = await seed(1);
    const list = await request(app).get('/api/transactions').set(headers);
    const res = await request(app).get(`/api/transactions/${list.body.items[0].id}`).set(headers);
    expect(res.body.description).toBe('Lunch 1');
  });

  it("returns 404 for another user's transaction", async () => {
    const { headers } = await seed(1);
    const list = await request(app).get('/api/transactions').set(headers);
    const other = await userWithDefaults(app);
    const res = await request(app)
      .get(`/api/transactions/${list.body.items[0].id}`)
      .set(other.headers);
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/transactions/:id', () => {
  it('updates fields', async () => {
    const { headers } = await seed(1);
    const list = await request(app).get('/api/transactions').set(headers);
    const res = await request(app)
      .patch(`/api/transactions/${list.body.items[0].id}`)
      .set(headers)
      .send({ amount: 9999, notes: 'Split with a friend' });
    expect(res.body).toMatchObject({ amount: 9999, notes: 'Split with a friend' });
  });

  it('rejects switching type without a matching category', async () => {
    const { headers } = await seed(1);
    const list = await request(app).get('/api/transactions').set(headers);
    const res = await request(app)
      .patch(`/api/transactions/${list.body.items[0].id}`)
      .set(headers)
      .send({ type: 'income' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/transactions/:id', () => {
  it('deletes a transaction', async () => {
    const { headers } = await seed(2);
    const list = await request(app).get('/api/transactions').set(headers);
    await request(app)
      .delete(`/api/transactions/${list.body.items[0].id}`)
      .set(headers)
      .expect(204);
    const after = await request(app).get('/api/transactions').set(headers);
    expect(after.body.total).toBe(1);
  });
});
