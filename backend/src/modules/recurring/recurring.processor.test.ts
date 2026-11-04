import request from 'supertest';
import { createApp } from '../../app.ts';
import { prisma } from '../../lib/prisma.ts';
import { resetDatabase } from '../../test/db.ts';
import { userWithDefaults } from '../../test/fixtures.ts';
import { processDueRules } from './recurring.processor.ts';

const app = createApp();

beforeEach(resetDatabase);

async function createRule(extra = {}) {
  const user = await userWithDefaults(app);
  const res = await request(app)
    .post('/api/recurring')
    .set(user.headers)
    .send({
      type: 'expense',
      amount: 1000,
      description: 'Gym',
      categoryId: user.groceriesId,
      accountId: user.accountId,
      frequency: 'monthly',
      startDate: '2026-08-31',
      ...extra,
    });
  return { user, rule: res.body };
}

describe('processDueRules', () => {
  it('catches up on all missed occurrences', async () => {
    await createRule();
    const created = await processDueRules('2026-11-04');
    const dates = (await prisma.transaction.findMany({ orderBy: { date: 'asc' } })).map((t) =>
      t.date.toISOString().slice(0, 10),
    );
    expect(created).toBe(3);
    expect(dates).toEqual(['2026-08-31', '2026-09-30', '2026-10-31']);
  });

  it('does not create duplicates when run twice', async () => {
    await createRule();
    await processDueRules('2026-11-04');
    expect(await processDueRules('2026-11-04')).toBe(0);
  });

  it('stops and deactivates after the end date', async () => {
    const { rule } = await createRule({ endDate: '2026-09-30' });
    expect(await processDueRules('2026-11-04')).toBe(2);
    const stored = await prisma.recurringRule.findUniqueOrThrow({ where: { id: rule.id } });
    expect(stored.active).toBe(false);
  });

  it('skips paused rules', async () => {
    const { user, rule } = await createRule();
    await request(app).patch(`/api/recurring/${rule.id}`).set(user.headers).send({ active: false });
    expect(await processDueRules('2026-11-04')).toBe(0);
  });
});
