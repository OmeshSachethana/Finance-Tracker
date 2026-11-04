# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-04

First release.

### Added

- Sign up, sign in and sign out with rotating refresh tokens and rate-limited login.
- Transactions with categories, accounts, tags and notes; search, filters, sorting, pagination, bulk delete and CSV export.
- Dashboard with monthly totals, savings rate, change versus the same days of last month, spending by category and a six-month trend.
- Monthly budgets per category with warning thresholds and copying from the previous month.
- Savings goals with deadlines, contributions and withdrawals.
- Recurring transactions that run hourly and catch up on missed dates.
- Reports for preset periods with income and spending by category and a 12-month trend.
- Accounts with live balances, archiving and net worth.
- Categories with colours and icons, including moving transactions when deleting one.
- Profile settings, display currency, password change and account deletion.
- Admin area with platform statistics, user search, role changes and user removal.
- Budget overview on the dashboard showing the categories closest to their limit.
- Page titles in the browser tab and an `N` keyboard shortcut to add a transaction.
- Dark mode, mobile layout and reduced-motion support.
- Docker images and a production Compose stack with nginx.
- Unit, integration and end-to-end tests running in GitHub Actions.
