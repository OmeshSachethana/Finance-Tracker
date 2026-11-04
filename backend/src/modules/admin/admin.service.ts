import type { Pagination } from '@finance-tracker/shared';
import type { Prisma } from '../../generated/prisma/client.ts';
import { badRequest, notFound } from '../../lib/errors.ts';
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

/** Paginated user list with transaction counts, optionally filtered by name or email. */
export async function listUsers({ page, pageSize, search }: Pagination & { search?: string }) {
  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { transactions: true } } },
    }),
    prisma.user.count({ where }),
  ]);
  return { users, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function setUserRole(actorId: string, userId: string, role: 'USER' | 'ADMIN') {
  if (actorId === userId) throw badRequest('You cannot change your own role');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('User not found');
  return prisma.user.update({ where: { id: userId }, data: { role } });
}

export async function deleteUser(actorId: string, userId: string) {
  if (actorId === userId) throw badRequest('You cannot delete your own account here');
  const { count } = await prisma.user.deleteMany({ where: { id: userId } });
  if (count === 0) throw notFound('User not found');
}
