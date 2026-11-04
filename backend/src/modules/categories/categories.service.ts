import type { CreateCategoryInput, UpdateCategoryInput } from '@finance-tracker/shared';
import { conflict, notFound } from '../../lib/errors.ts';
import { toDbTransactionType } from '../../lib/mappers.ts';
import { prisma } from '../../lib/prisma.ts';
import type { TransactionType } from '../../generated/prisma/client.ts';

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

async function assertNameAvailable(
  userId: string,
  name: string,
  type: TransactionType,
  exceptId?: string,
) {
  const existing = await prisma.category.findFirst({
    where: { userId, type, name: { equals: name, mode: 'insensitive' } },
  });
  if (existing && existing.id !== exceptId) {
    throw conflict(`A category named "${name}" already exists`);
  }
}

export async function createCategory(userId: string, input: CreateCategoryInput) {
  await assertNameAvailable(userId, input.name, toDbTransactionType(input.type));
  return prisma.category.create({
    data: { ...input, type: toDbTransactionType(input.type), userId },
  });
}

export async function updateCategory(userId: string, id: string, input: UpdateCategoryInput) {
  const current = await getCategory(userId, id);
  const type = input.type ? toDbTransactionType(input.type) : current.type;
  if (input.name) await assertNameAvailable(userId, input.name, type, id);
  return prisma.category.update({
    where: { id },
    data: { ...input, type },
  });
}

export async function deleteCategory(userId: string, id: string) {
  await getCategory(userId, id);
  const used = await prisma.transaction.count({ where: { categoryId: id } });
  if (used > 0) {
    throw conflict('This category has transactions. Move them to another category first.');
  }
  await prisma.category.delete({ where: { id } });
}
