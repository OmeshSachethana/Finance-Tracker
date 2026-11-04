# 001: Store money as integer minor units

## Context

Floating point numbers cannot represent most decimal amounts exactly. `0.1 + 0.2` is `0.30000000000000004`, so totals drift and comparisons against budget limits can be off by a cent.

## Decision

Every amount is an integer number of minor units (cents for USD, yen for JPY) in the database, the API and the app state. Conversion to and from decimals happens only at the edges: when a user types an amount, and when it is displayed.

## Consequences

- Sums and comparisons are exact.
- Each currency needs its number of decimal places (`CURRENCY_DECIMALS`).
- Amounts are capped to fit a 32-bit integer column (about 21 million in a two-decimal currency), which is plenty for personal finance.
