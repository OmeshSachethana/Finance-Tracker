import type { ChangePasswordInput, UpdateProfileInput } from '@finance-tracker/shared';
import { badRequest } from '../../lib/errors.ts';
import { hashPassword, verifyPassword } from '../../lib/password.ts';
import { prisma } from '../../lib/prisma.ts';

export function updateProfile(userId: string, input: UpdateProfileInput) {
  return prisma.user.update({ where: { id: userId }, data: input });
}

/** Changes the password and signs out every other session. */
export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
    throw badRequest('Current password is incorrect');
  }
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hashPassword(input.newPassword) },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}
