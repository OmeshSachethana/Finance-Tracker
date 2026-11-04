import type { LoginInput, RegisterInput } from '@finance-tracker/shared';
import { conflict, unauthorized } from '../../lib/errors.ts';
import { hashPassword, verifyPassword } from '../../lib/password.ts';
import { prisma } from '../../lib/prisma.ts';

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw conflict('An account with this email already exists');

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    },
  });
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw unauthorized('Invalid email or password');
  }
  return user;
}
