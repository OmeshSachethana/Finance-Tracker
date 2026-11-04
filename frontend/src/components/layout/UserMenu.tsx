import { LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
      <div
        aria-hidden
        className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-200"
      >
        {initials(user.name)}
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        aria-label="Sign out"
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
      >
        <LogOut className="size-5" />
      </button>
    </div>
  );
}
