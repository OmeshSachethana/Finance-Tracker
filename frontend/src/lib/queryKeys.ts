/** Central query keys so related caches can be invalidated together. */
export const queryKeys = {
  categories: ['categories'] as const,
  accounts: ['accounts'] as const,
  transactions: ['transactions'] as const,
  stats: ['stats'] as const,
  budgets: ['budgets'] as const,
  goals: ['goals'] as const,
  recurring: ['recurring'] as const,
  admin: ['admin'] as const,
};
