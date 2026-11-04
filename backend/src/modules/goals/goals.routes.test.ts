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

  it('updates and deletes a goal', async () => {
    const { Authorization } = await authHeader(app);
    const created = await request(app).post('/api/goals').set({ Authorization }).send(goal);
    const updated = await request(app)
      .patch(`/api/goals/${created.body.id}`)
      .set({ Authorization })
      .send({ name: 'Rainy day fund' });
    expect(updated.body.name).toBe('Rainy day fund');
    await request(app).delete(`/api/goals/${created.body.id}`).set({ Authorization }).expect(204);
  });
});
