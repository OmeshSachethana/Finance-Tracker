# Contributing

Thanks for helping improve Finance Tracker.

## Setup

Follow [Getting started](README.md#getting-started) to run the app locally with demo data.

## Workflow

1. Create a branch from `develop`.
2. Keep each commit to one change with a short message in plain English, for example `Add budget alerts` or `Fix date shown in the wrong timezone`.
3. Add or update tests with your change.
4. Make sure everything passes before opening a pull request:

   ```bash
   npm run lint && npm run typecheck && npm test
   npm run test:e2e -w frontend
   ```

5. Open a pull request into `develop` and describe what changed and how you tested it.

The pre-commit hook formats and lints staged files automatically.

## Code style

- TypeScript everywhere, in strict mode.
- Validation schemas belong in `shared/` so the API and the forms use the same rules.
- Store money as integer minor units (cents). Never use floats for amounts.
- Backend features live in `backend/src/modules/<feature>` with routes, service, serializer and tests side by side.
- Frontend features live in `frontend/src/features/<feature>`; pages in `frontend/src/pages` only compose them.

## Database changes

Edit `backend/prisma/schema.prisma`, then run:

```bash
npm run db:migrate -w backend -- --name describe_your_change
```

Commit the generated migration together with the schema change.
