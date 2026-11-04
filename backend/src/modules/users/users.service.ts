import type { UpdateProfileInput } from '@finance-tracker/shared';
import { prisma } from '../../lib/prisma.ts';

export function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({ where: { id: userId }, data: input });
}
