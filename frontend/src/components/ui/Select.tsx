import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { inputClasses } from './Input';

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(inputClasses, 'pr-8', className)} {...props} />;
}
