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

  it('tracks contributions and completion', async () => {
    const { Authorization } = await authHeader(app);
    const created = await request(app)
      .post('/api/goals')
      .set({ Authorization })
      .send({ ...goal, targetAmount: 1000 });
    const url = `/api/goals/${created.body.id}/contributions`;
    await request(app).post(url).set({ Authorization }).send({ amount: 600 });
    const res = await request(app).post(url).set({ Authorization }).send({ amount: 400 });
    expect(res.body).toMatchObject({ savedAmount: 1000, percent: 100, completed: true });
  });

  it('does not allow withdrawing more than saved', async () => {
    const { Authorization } = await authHeader(app);
    const created = await request(app).post('/api/goals').set({ Authorization }).send(goal);
    const res = await request(app)
      .post(`/api/goals/${created.body.id}/contributions`)
      .set({ Authorization })
      .send({ amount: -100 });
    expect(res.status).toBe(400);
  });
});
