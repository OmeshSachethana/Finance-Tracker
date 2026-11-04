import { paginationSchema } from './pagination';

describe('paginationSchema', () => {
  it('uses defaults when empty', () => {
    expect(paginationSchema.parse({})).toEqual({ page: 1, pageSize: 20 });
  });

  it('coerces query string values', () => {
    expect(paginationSchema.parse({ page: '3', pageSize: '50' })).toEqual({
      page: 3,
      pageSize: 50,
    });
  });

  it('caps the page size', () => {
    expect(paginationSchema.safeParse({ pageSize: 500 }).success).toBe(false);
  });
});
