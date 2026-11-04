import { api, setAccessToken } from './client';
import { ApiError } from './ApiError';

function mockFetch(...responses: Response[]) {
  const fn = vi.fn();
  for (const r of responses) fn.mockResolvedValueOnce(r);
  vi.stubGlobal('fetch', fn);
  return fn;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

afterEach(() => {
  vi.unstubAllGlobals();
  setAccessToken(null);
});

describe('api', () => {
  it('prefixes the path and builds the query string', async () => {
    const fetch = mockFetch(json(200, { ok: true }));
    await api('/transactions', { query: { page: 2, search: '', type: undefined } });
    expect(fetch.mock.calls[0]![0]).toBe('/api/transactions?page=2');
  });

  it('sends JSON bodies and the access token', async () => {
    const fetch = mockFetch(json(201, {}));
    setAccessToken('abc');
    await api('/goals', { method: 'POST', body: { name: 'Trip' } });
    const init = fetch.mock.calls[0]![1] as RequestInit;
    expect(init.body).toBe('{"name":"Trip"}');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer abc');
  });

  it('throws ApiError with server details', async () => {
    mockFetch(
      json(400, {
        error: {
          code: 'BAD_REQUEST',
          message: 'Validation failed',
          details: { name: ['Required'] },
        },
      }),
    );
    const error = await api('/goals').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      message: 'Validation failed',
      details: { name: ['Required'] },
    });
  });

  it('returns undefined for 204 responses', async () => {
    mockFetch(new Response(null, { status: 204 }));
    expect(await api('/goals/1', { method: 'DELETE' })).toBeUndefined();
  });
});
