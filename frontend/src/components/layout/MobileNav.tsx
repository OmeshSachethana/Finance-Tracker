import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SidebarNav } from './Sidebar';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
      >
        <Menu className="size-5" />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Menu"
        className="mt-0 ml-0 h-full max-h-full max-w-72 rounded-none"
      >
        <SidebarNav onNavigate={() => setOpen(false)} />
      </Modal>
    </>
  );
}
