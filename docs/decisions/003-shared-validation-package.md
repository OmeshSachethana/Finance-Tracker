# 003: One shared package for validation and types

## Context

The forms in the browser and the API both validate the same data. Keeping two copies of the rules leads to forms that accept input the API rejects, or the reverse.

## Decision

A `shared` npm workspace holds the Zod schemas, the TypeScript types inferred from them, default categories and pure helpers (money, dates, budgets, recurrence). Both the frontend and the backend import it directly from source.

## Consequences

- A rule changes in one place and both sides pick it up.
- Calculations such as budget progress give the same answer in the browser and on the server.
- The shared package must stay free of browser-only or Node-only code.
