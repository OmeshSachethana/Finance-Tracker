import { prisma } from '../../lib/prisma.ts';

/** Platform-wide counts for the admin dashboard. */
export async function getPlatformStats(now = new Date()) {
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [users, newUsers, activeUsers, transactions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { lastLoginAt: { gte: thirtyDaysAgo } } }),
    prisma.transaction.count(),
  ]);
  return { users, newUsers, activeUsers, transactions };
}
