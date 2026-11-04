import { z } from 'zod';
import { CURRENCIES } from '../constants/currencies';

export const idSchema = z.uuid();

export const isoDateSchema = z.iso.date();

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #4f46e5');

export const currencySchema = z.enum(CURRENCIES);

/** Positive amount in integer minor units (e.g. cents). Capped to fit a 32-bit column. */
export const amountSchema = z
  .number()
  .int('Amount must be in whole minor units')
  .positive('Amount must be greater than zero')
  .max(2_000_000_000, 'Amount is too large');
