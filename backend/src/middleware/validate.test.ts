import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { errorHandler } from './errorHandler.ts';
import { validateBody, validateQuery } from './validate.ts';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.post('/body', validateBody(z.object({ name: z.string().trim().min(1) })), (req, res) => {
    res.json(req.body);
  });
  app.get(
    '/query',
    validateQuery(z.object({ page: z.coerce.number().default(1) })),
    (_req, res) => {
      res.json(res.locals.query);
    },
  );
  app.use(errorHandler);
  return app;
}

describe('validateBody', () => {
  it('passes parsed data to the handler', async () => {
    const res = await request(buildApp()).post('/body').send({ name: '  Jane  ' });
    expect(res.body).toEqual({ name: 'Jane' });
  });

  it('returns field errors on invalid input', async () => {
    const res = await request(buildApp()).post('/body').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.details.name).toBeDefined();
  });
});

describe('validateQuery', () => {
  it('coerces and defaults query values', async () => {
    const res = await request(buildApp()).get('/query');
    expect(res.body).toEqual({ page: 1 });
  });

  it('rejects invalid values', async () => {
    const res = await request(buildApp()).get('/query?page=abc');
    expect(res.status).toBe(400);
  });
});
