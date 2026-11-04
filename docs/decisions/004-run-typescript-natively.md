# 004: Run the backend as TypeScript directly on Node.js

## Context

Node.js 24 can run TypeScript files by stripping type annotations, as long as the code only uses syntax that can be erased (no enums, namespaces or parameter properties).

## Decision

The backend runs `node src/server.ts` in every environment, with `node --watch` in development. TypeScript is used only for type checking (`tsc --noEmit`) and the `erasableSyntaxOnly` option keeps the code compatible. Imports use explicit `.ts` extensions.

## Consequences

- No build step, no `dist` folder and no source maps to manage for the API.
- Development and production run exactly the same files.
- Some TypeScript features (enums, namespaces) are off limits; plain objects and unions are used instead.
