import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export const inputClasses =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(inputClasses, className)} {...props} />;
}
