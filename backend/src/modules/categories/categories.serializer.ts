import type { Category as CategoryDto } from '@finance-tracker/shared';
import type { Category } from '../../generated/prisma/client.ts';
import { fromDbTransactionType } from '../../lib/mappers.ts';

export function toCategoryDto(category: Category): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    type: fromDbTransactionType(category.type),
    color: category.color,
    icon: category.icon,
  };
}
