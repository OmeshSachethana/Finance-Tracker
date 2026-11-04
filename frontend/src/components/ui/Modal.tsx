import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Accessible modal built on the native <dialog> element (focus trap and Escape for free). */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="modal-title"
      className={cn(
        'm-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
        className,
      )}
    >
      {open && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer && (
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
              {footer}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}
