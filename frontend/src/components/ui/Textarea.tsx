import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { inputClasses } from './Input';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(inputClasses, 'h-auto min-h-20 py-2', className)} {...props} />;
}
