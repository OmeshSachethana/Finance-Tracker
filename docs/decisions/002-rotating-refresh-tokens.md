# 002: Short-lived access tokens with rotating refresh tokens

## Context

The app needs to keep users signed in across page reloads without storing long-lived secrets where scripts can read them.

## Decision

- A signed JWT **access token** lives for 15 minutes and is kept only in memory in the browser.
- A random **refresh token** is set as an `httpOnly`, `SameSite=Strict` cookie limited to `/api/auth`. Only its SHA-256 hash is stored in the database.
- Each refresh **rotates** the token: the old one is revoked and a new one issued.
- Logout revokes the token; a password change revokes all of the user's tokens.

## Consequences

- Scripts on the page cannot read the refresh token, which limits the damage of an XSS bug.
- A leaked refresh token stops working as soon as either party uses it.
- A database leak does not expose usable refresh tokens.
- Every page load makes one refresh request to restore the session.
