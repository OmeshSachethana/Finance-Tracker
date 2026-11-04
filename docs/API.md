# API reference

All endpoints are under `/api`. Requests and responses use JSON. Amounts are integers in minor units (cents), dates are `YYYY-MM-DD` and months are `YYYY-MM`.

## Authentication

Protected endpoints need an access token:

```http
Authorization: Bearer <accessToken>
```

Access tokens expire after 15 minutes. Call `POST /api/auth/refresh` to get a new one using the `refresh_token` cookie.

## Errors

Errors share one shape:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": { "amount": ["Amount must be greater than zero"] }
  }
}
```

| Status | Code                | When                                               |
| ------ | ------------------- | -------------------------------------------------- |
| 400    | `BAD_REQUEST`       | Invalid input; `details` lists problems per field  |
| 401    | `UNAUTHORIZED`      | Missing, invalid or expired token                  |
| 403    | `FORBIDDEN`         | Signed in but not allowed (e.g. not an admin)      |
| 404    | `NOT_FOUND`         | The item does not exist or belongs to someone else |
| 409    | `CONFLICT`          | Duplicate, or the item is still in use             |
| 413    | `PAYLOAD_TOO_LARGE` | Request body over 100 KB                           |
| 429    | `TOO_MANY_REQUESTS` | Too many login or registration attempts            |

## Auth

| Method | Path             | Body                        | Returns                                                   |
| ------ | ---------------- | --------------------------- | --------------------------------------------------------- |
| POST   | `/auth/register` | `name`, `email`, `password` | `201` `{ user, accessToken }` and sets the refresh cookie |
| POST   | `/auth/login`    | `email`, `password`         | `{ user, accessToken }` and sets the refresh cookie       |
| POST   | `/auth/refresh`  | none (uses the cookie)      | `{ user, accessToken }` with a rotated cookie             |
| POST   | `/auth/logout`   | none                        | `204`, revokes the refresh token                          |
| GET    | `/auth/me`       | none                        | `{ user }`                                                |

Passwords need at least 8 characters with a lowercase letter, an uppercase letter and a number.

## Profile

| Method | Path                 | Body                             | Returns                                 |
| ------ | -------------------- | -------------------------------- | --------------------------------------- |
| PATCH  | `/users/me`          | `name?`, `currency?`             | `{ user }`                              |
| POST   | `/users/me/password` | `currentPassword`, `newPassword` | `204`, signs out other sessions         |
| DELETE | `/users/me`          | `password`                       | `204`, deletes the account and all data |

## Transactions

| Method | Path                        | Notes                                                                                                                                                                                      |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET    | `/transactions`             | Paginated list. Query: `page`, `pageSize` (max 100), `type`, `categoryId`, `accountId`, `from`, `to`, `search`, `tag`, `sortBy` (`date`, `amount`, `description`), `order` (`asc`, `desc`) |
| POST   | `/transactions`             | `type`, `amount`, `date`, `description`, `categoryId`, `accountId`, `notes?`, `tags?`                                                                                                      |
| GET    | `/transactions/:id`         | One transaction                                                                                                                                                                            |
| PATCH  | `/transactions/:id`         | Any create field                                                                                                                                                                           |
| DELETE | `/transactions/:id`         | `204`                                                                                                                                                                                      |
| POST   | `/transactions/bulk-delete` | `{ ids }` (up to 100), returns `{ deleted }`                                                                                                                                               |
| GET    | `/transactions/export`      | CSV download; accepts the same filters as the list                                                                                                                                         |

The category's type must match the transaction's type.

List responses look like:

```json
{ "items": [], "page": 1, "pageSize": 20, "total": 37, "totalPages": 2 }
```

## Categories and accounts

| Method | Path              | Notes                                                                   |
| ------ | ----------------- | ----------------------------------------------------------------------- |
| GET    | `/categories`     | All of the user's categories                                            |
| POST   | `/categories`     | `name`, `type`, `color` (`#rrggbb`), `icon`                             |
| PATCH  | `/categories/:id` | `name?`, `color?`, `icon?`                                              |
| DELETE | `/categories/:id` | `409` if it has transactions; add `?reassignTo=<id>` to move them first |
| GET    | `/accounts`       | Accounts with a computed `balance`                                      |
| POST   | `/accounts`       | `name`, `type`, `currency`, `openingBalance`, `color`                   |
| PATCH  | `/accounts/:id`   | Any create field, plus `archived`                                       |
| DELETE | `/accounts/:id`   | `409` if it has transactions; archive it instead                        |

## Budgets, goals and recurring rules

| Method | Path                       | Notes                                                                                            |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------ |
| GET    | `/budgets?month=YYYY-MM`   | Budgets with `spent`, `remaining`, `percent` and `status` (`ok`, `warning`, `exceeded`)          |
| POST   | `/budgets`                 | `categoryId` (expense only), `month`, `limit`, `alertThreshold?` (default 80)                    |
| PATCH  | `/budgets/:id`             | `limit?`, `alertThreshold?`                                                                      |
| DELETE | `/budgets/:id`             | `204`                                                                                            |
| POST   | `/budgets/copy-previous`   | `{ month }`, returns `{ copied }`                                                                |
| GET    | `/goals`                   | Goals with `percent` and `completed`                                                             |
| POST   | `/goals`                   | `name`, `targetAmount`, `color`, `deadline?`                                                     |
| PATCH  | `/goals/:id`               | Any create field                                                                                 |
| DELETE | `/goals/:id`               | `204`                                                                                            |
| POST   | `/goals/:id/contributions` | `{ amount }`; negative to withdraw, cannot go below zero                                         |
| GET    | `/recurring`               | Rules ordered by next run date                                                                   |
| POST   | `/recurring`               | `type`, `amount`, `description`, `categoryId`, `accountId`, `frequency`, `startDate`, `endDate?` |
| PATCH  | `/recurring/:id`           | `amount?`, `description?`, `endDate?`, `active?`                                                 |
| DELETE | `/recurring/:id`           | `204`                                                                                            |
| POST   | `/recurring/run`           | Creates any due transactions now, returns `{ created }`                                          |

## Stats

| Method | Path                              | Returns                                                                           |
| ------ | --------------------------------- | --------------------------------------------------------------------------------- |
| GET    | `/stats/summary?from&to`          | `{ income, expense, balance, savingsRate, count }`                                |
| GET    | `/stats/by-category?from&to&type` | `{ items: [{ categoryId, total, count }] }`, largest first                        |
| GET    | `/stats/monthly?months=6`         | `{ items: [{ month, income, expense }] }` for recent months, including empty ones |

## Admin

Requires the admin role.

| Method | Path                    | Notes                                                          |
| ------ | ----------------------- | -------------------------------------------------------------- |
| GET    | `/admin/stats`          | `{ users, newUsers, activeUsers, transactions }`               |
| GET    | `/admin/users`          | Paginated; `search` matches name or email                      |
| PATCH  | `/admin/users/:id/role` | `{ role: 'user' \| 'admin' }`; you cannot change your own role |
| DELETE | `/admin/users/:id`      | `204`; you cannot delete yourself here                         |

## Health

`GET /health` returns `{ status: "ok", uptime }` and needs no token.
