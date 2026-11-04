# Finance Tracker

A full-stack personal finance app for tracking income and expenses, setting monthly budgets, saving towards goals and automating recurring bills.

![Dashboard](docs/screenshots/dashboard.png)

## Features

- **Transactions**: add, edit and delete income and expenses with categories, accounts, tags and notes. Search, filter by type, category, account and date, sort any column, select many to delete at once, and export to CSV.
- **Dashboard**: monthly income, expenses, net balance and savings rate, compared with the same days of last month, plus spending by category and a six-month trend.
- **Budgets**: monthly limits per category with progress, early warnings at a threshold you choose, and one-click copying from last month.
- **Savings goals**: targets with optional deadlines, contributions and withdrawals.
- **Recurring transactions**: daily, weekly, monthly or yearly rules that create transactions automatically, including catching up on missed dates.
- **Reports**: income and spending by category for any period, a 12-month trend and CSV export.
- **Accounts**: cash, bank, credit card, savings and wallet accounts with live balances and net worth.
- **Settings**: display currency, profile, password change and account deletion.
- **Admin**: platform statistics, user search, role changes and user removal.
- **Polish**: dark mode, mobile layout, keyboard-friendly dialogs, reduced-motion support and accessible charts with a table view.

| Dark mode                                                      | Mobile                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| ![Dashboard in dark mode](docs/screenshots/dashboard-dark.png) | ![Dashboard on a phone](docs/screenshots/dashboard-mobile.png) |

## Tech stack

| Area     | Tools                                                                                               |
| -------- | --------------------------------------------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, React Hook Form, Recharts   |
| Backend  | Node.js 24, Express 5, Prisma 7, PostgreSQL 17, Zod, JWT access tokens with rotating refresh tokens |
| Shared   | A `shared` workspace with validation schemas, types and money/date helpers used by both sides       |
| Testing  | Vitest, Testing Library, Supertest against a real database, Playwright end-to-end tests             |
| Tooling  | ESLint, Prettier, Husky, lint-staged, GitHub Actions, Docker                                        |

## Getting started

You need **Node.js 24**, **npm 11** and **Docker** (for PostgreSQL).

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Start PostgreSQL on localhost:5440
docker compose up -d

# 3. Create the backend environment file
cp backend/.env.example backend/.env

# 4. Create the tables and load demo data
npm run db:deploy -w backend
npm run db:seed -w backend

# 5. Start the API (port 4000) and the app (port 5180)
npm run dev
```

Open <http://localhost:5180> and sign in with a demo account:

| Role                                  | Email               | Password      |
| ------------------------------------- | ------------------- | ------------- |
| User with three months of sample data | `demo@example.com`  | `Password123` |
| Admin                                 | `admin@example.com` | `Password123` |

## Scripts

Run these from the repository root.

| Command                         | What it does                                                               |
| ------------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                   | Starts the API and the app together with live reload                       |
| `npm test`                      | Runs unit and integration tests in every workspace                         |
| `npm run test:e2e -w frontend`  | Runs the Playwright end-to-end tests (needs the dev servers and demo data) |
| `npm run lint`                  | Lints every workspace                                                      |
| `npm run typecheck`             | Type-checks every workspace                                                |
| `npm run format`                | Formats the code with Prettier                                             |
| `npm run build`                 | Builds the frontend for production                                         |
| `npm run db:migrate -w backend` | Creates and applies a new migration after a schema change                  |
| `npm run db:studio -w backend`  | Opens Prisma Studio to browse the database                                 |
