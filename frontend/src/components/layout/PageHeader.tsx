import type { ReactNode } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Tab title when it should differ from the heading. */
  documentTitle?: string;
}

export function PageHeader({ title, description, actions, documentTitle }: PageHeaderProps) {
  useDocumentTitle(documentTitle ?? title);
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
