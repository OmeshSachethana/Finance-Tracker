import type { AccountType } from '@finance-tracker/shared';
import { Banknote, CreditCard, Landmark, PiggyBank, Wallet, type LucideIcon } from 'lucide-react';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank: 'Bank account',
  cash: 'Cash',
  credit_card: 'Credit card',
  savings: 'Savings',
  wallet: 'Digital wallet',
};

export const ACCOUNT_TYPE_ICONS: Record<AccountType, LucideIcon> = {
  bank: Landmark,
  cash: Banknote,
  credit_card: CreditCard,
  savings: PiggyBank,
  wallet: Wallet,
};
