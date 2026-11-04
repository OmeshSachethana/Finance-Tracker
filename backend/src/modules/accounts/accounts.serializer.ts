import type { Account as AccountDto, CurrencyCode } from '@finance-tracker/shared';
import type { Account } from '../../generated/prisma/client.ts';
import { fromDbAccountType } from '../../lib/mappers.ts';

export function toAccountDto(account: Account, balance: number): AccountDto & { balance: number } {
  return {
    id: account.id,
    name: account.name,
    type: fromDbAccountType(account.type),
    currency: account.currency as CurrencyCode,
    openingBalance: account.openingBalance,
    color: account.color,
    archived: account.archived,
    balance,
  };
}
