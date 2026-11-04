import type { User as UserDto } from '@finance-tracker/shared';
import type { User } from '../../generated/prisma/client.ts';

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'admin' : 'user',
    currency: user.currency,
    createdAt: user.createdAt.toISOString(),
  };
}
