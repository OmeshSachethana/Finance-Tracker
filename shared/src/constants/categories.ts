import type { CreateCategoryInput } from '../schemas/category';

export const DEFAULT_EXPENSE_CATEGORIES: CreateCategoryInput[] = [
  { name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'utensils' },
  { name: 'Groceries', type: 'expense', color: '#84cc16', icon: 'shopping-cart' },
  { name: 'Transport', type: 'expense', color: '#0ea5e9', icon: 'car' },
  { name: 'Housing', type: 'expense', color: '#8b5cf6', icon: 'home' },
  { name: 'Utilities', type: 'expense', color: '#eab308', icon: 'zap' },
  { name: 'Health', type: 'expense', color: '#ef4444', icon: 'heart-pulse' },
  { name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'film' },
  { name: 'Shopping', type: 'expense', color: '#14b8a6', icon: 'shopping-bag' },
  { name: 'Education', type: 'expense', color: '#6366f1', icon: 'graduation-cap' },
  { name: 'Other', type: 'expense', color: '#64748b', icon: 'circle-ellipsis' },
];
