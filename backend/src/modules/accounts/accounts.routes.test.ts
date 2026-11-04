import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';

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
