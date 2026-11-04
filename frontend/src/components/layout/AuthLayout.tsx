import { Wallet } from 'lucide-react';
import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="rounded-xl bg-brand-600 p-2.5 text-white">
            <Wallet className="size-6" aria-hidden />
          </div>
          <p className="text-lg font-semibold">Finance Tracker</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
