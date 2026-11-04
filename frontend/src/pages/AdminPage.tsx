import { Activity, ArrowLeftRight, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useToast } from '@/components/toast/useToast';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  useAdminUsers,
  useDeleteUser,
  usePlatformStats,
  useSetUserRole,
  type AdminUser,
} from '@/features/admin/api';
import { useAuth } from '@/features/auth/useAuth';
import { StatTile } from '@/features/dashboard/StatTile';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ApiError } from '@/lib/api/ApiError';
import { formatDate } from '@/lib/dates';

export function AdminPage() {
  const toast = useToast();
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const { data: stats } = usePlatformStats();
  const { data: users, isLoading } = useAdminUsers({ page, search: debouncedSearch || undefined });
  const setRole = useSetUserRole();
  const deleteUser = useDeleteUser();
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  const changeRole = async (user: AdminUser, role: 'user' | 'admin') => {
    try {
      await setRole.mutateAsync({ id: user.id, role });
      toast(`${user.name} is now ${role === 'admin' ? 'an admin' : 'a regular user'}`);
    } catch (error) {
      toast(error instanceof ApiError ? error.message : 'Could not change role', 'error');
    }
  };

  return (
    <>
      <PageHeader title="Admin" description="Platform activity and user management." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Users" icon={Users} value={stats && String(stats.users)} />
        <StatTile label="New (30 days)" icon={UserPlus} value={stats && String(stats.newUsers)} />
        <StatTile
          label="Active (30 days)"
          icon={Activity}
          value={stats && String(stats.activeUsers)}
        />
        <StatTile
          label="Transactions"
          icon={ArrowLeftRight}
          value={stats && stats.transactions.toLocaleString()}
        />
      </div>

      <Card className="mt-6">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search users"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 text-left text-xs text-slate-500 uppercase dark:border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Role
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
                    Joined
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
                    Last login
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Transactions
                  </th>
                  <th scope="col" className="w-12 px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users?.items.map((user) => {
                  const isMe = user.id === me?.id;
                  return (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {user.name} {isMe && <Badge tone="brand">You</Badge>}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          aria-label={`Role for ${user.name}`}
                          value={user.role}
                          disabled={isMe}
                          onChange={(e) => changeRole(user, e.target.value as 'user' | 'admin')}
                          className="h-8 w-28"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                        {formatDate(user.createdAt.slice(0, 10))}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-500 md:table-cell">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt.slice(0, 10)) : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{user.transactionCount}</td>
                      <td className="px-4 py-3">
                        {!isMe && (
                          <button
                            type="button"
                            onClick={() => setDeleting(user)}
                            aria-label={`Delete ${user.name}`}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {users && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Pagination
              page={users.page}
              totalPages={users.totalPages}
              total={users.total}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.name}?`}
        message="Their account and all of their data will be permanently removed."
        confirmLabel="Delete user"
        destructive
        loading={deleteUser.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          await deleteUser.mutateAsync(deleting.id);
          toast(`${deleting.name} was deleted`);
          setDeleting(null);
        }}
      />
    </>
  );
}
