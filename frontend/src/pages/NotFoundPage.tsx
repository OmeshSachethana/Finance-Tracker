import { Compass } from 'lucide-react';
import { Link } from 'react-router';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={
          <Link
            to="/"
            className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
