# syntax=docker/dockerfile:1

# ---- Build: install all dependencies and generate the Prisma client ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Use the npm version the lockfile was written with (see packageManager).
RUN npm install -g "$(node -p "require('./package.json').packageManager")"
COPY shared/package.json shared/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend -w shared --ignore-scripts
COPY shared shared
COPY backend backend
RUN npm run db:generate -w backend

# ---- Migrate: one-off container that applies database migrations ----
FROM build AS migrate
WORKDIR /app/backend
CMD ["npx", "prisma", "migrate", "deploy"]

# ---- Runtime: production dependencies only ----
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g "$(node -p "require('./package.json').packageManager")"
COPY shared/package.json shared/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci -w backend -w shared --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/shared shared
COPY --from=build /app/backend/src backend/src
COPY --from=build /app/backend/package.json backend/

USER node
WORKDIR /app/backend
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/api/health || exit 1
CMD ["node", "src/server.ts"]
