import type { CurrencyCode, User as UserDto } from '@finance-tracker/shared';
import type { User } from '../../generated/prisma/client.ts';

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'admin' : 'user',
    currency: user.currency as CurrencyCode,
    createdAt: user.createdAt.toISOString(),
  };
}
