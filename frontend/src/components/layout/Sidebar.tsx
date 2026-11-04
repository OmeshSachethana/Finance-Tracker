import { Wallet } from 'lucide-react';
import { NavLink } from 'react-router';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from './navItems';

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || user?.role === 'admin');

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
            )
          }
        >
          <Icon className="size-5" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2 px-3">
      <div className="rounded-lg bg-brand-600 p-1.5 text-white">
        <Wallet className="size-5" aria-hidden />
      </div>
      <span className="font-semibold">Finance Tracker</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block dark:border-slate-800 dark:bg-slate-900">
      <Logo />
      <div className="mt-8">
        <SidebarNav />
      </div>
    </aside>
  );
}
