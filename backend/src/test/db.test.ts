import { prisma } from '../lib/prisma.ts';
import { resetDatabase } from './db.ts';

describe('resetDatabase', () => {
  it('removes existing users', async () => {
    await prisma.user.create({
      data: { name: 'Temp', email: 'temp@example.com', passwordHash: 'x' },
    });
    await resetDatabase();
    expect(await prisma.user.count()).toBe(0);
  });
});
