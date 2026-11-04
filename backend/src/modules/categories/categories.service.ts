import type { CreateCategoryInput, UpdateCategoryInput } from '@finance-tracker/shared';
import { conflict, notFound } from '../../lib/errors.ts';
import { toDbTransactionType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';

export function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });
}

export async function getCategory(userId: string, id: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw notFound('Category not found');
  return category;
}

async function assertNameAvailable(userId: string, name: string, type: string, exceptId?: string) {
  const existing = await prisma.category.findFirst({
    where: {
      userId,
      name: { equals: name, mode: 'insensitive' },
      type: toDbTransactionType(type as 'income' | 'expense'),
    },
  });
  if (existing && existing.id !== exceptId)
    throw conflict(`A category named "${name}" already exists`);
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  await assertNameAvailable(userId, input.name, input.type);
  return prisma.category.create({
    data: { ...input, type: toDbTransactionType(input.type), userId },
  });
}

export async function updateCategory(userId: string, id: string, input: UpdateCategoryInput) {
  const current = await getCategory(userId, id);
  if (input.name)
    await assertNameAvailable(
      userId,
      input.name,
      input.type ?? (current.type === 'INCOME' ? 'income' : 'expense'),
      id,
    );
  return prisma.category.update({
    where: { id },
    data: { ...input, type: input.type ? toDbTransactionType(input.type) : undefined },
  });
}
