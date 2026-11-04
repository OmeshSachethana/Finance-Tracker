import request from 'supertest';
import { createApp } from '../../app.ts';
import { authHeader } from '../../test/auth.ts';
import { resetDatabase } from '../../test/db.ts';

const app = createApp();
const goal = {
  name: 'Emergency fund',
  targetAmount: 500000,
  color: '#22c55e',
  deadline: '2027-06-30',
};

beforeEach(resetDatabase);

describe('goals', () => {
  it('creates and lists goals', async () => {
    const { Authorization } = await authHeader(app);
    await request(app).post('/api/goals').set({ Authorization }).send(goal).expect(201);
    const res = await request(app).get('/api/goals').set({ Authorization });
    expect(res.body.items[0]).toMatchObject({
      ...goal,
      savedAmount: 0,
      percent: 0,
      completed: false,
    });
  });
});
