# Security policy

Please do not report security problems in public issues.

Instead, email the maintainer at the address on the GitHub profile with a description of the issue and steps to reproduce it. You will get a reply within a few days, and a fix will be released as soon as possible.

## What the app does to protect data

- Passwords are hashed with bcrypt and never returned by the API.
- Refresh tokens are stored hashed, rotated on each use and revoked on logout or password change.
- Login and registration are rate limited per IP address.
- Every query is scoped to the signed-in user, and admin routes require the admin role.
- Security headers are set with Helmet and CORS only allows the app origin.
