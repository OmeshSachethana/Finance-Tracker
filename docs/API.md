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
