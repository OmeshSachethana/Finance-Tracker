import { z } from 'zod';

export const idSchema = z.uuid();

export const isoDateSchema = z.iso.date();

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #4f46e5');
