import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RedirectIfAuthenticated } from '@/features/auth/RedirectIfAuthenticated';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { BudgetsPage } from '@/pages/BudgetsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RecurringPage } from '@/pages/RecurringPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { TransactionsPage } from '@/pages/TransactionsPage';

export const routes = [
  {
    element: <RedirectIfAuthenticated />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'budgets', element: <BudgetsPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'recurring', element: <RecurringPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
