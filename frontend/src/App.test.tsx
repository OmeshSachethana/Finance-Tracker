import { screen } from '@testing-library/react';
import { routes } from './app/router';
import { renderWithProviders } from './test/render';

function mockFetch(handler: (url: string) => Response) {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => Promise.resolve(handler(url))),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('App routing', () => {
  it('sends signed-out users to the login page', async () => {
    mockFetch(() => new Response('{}', { status: 401 }));
    renderWithProviders(routes, '/');
    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('shows the app to users with a session', async () => {
    mockFetch(
      () =>
        new Response(
          JSON.stringify({
            accessToken: 't',
            user: {
              id: '1',
              name: 'Jane Doe',
              email: 'jane@example.com',
              role: 'user',
              currency: 'USD',
              createdAt: '',
            },
          }),
        ),
    );
    renderWithProviders(routes, '/');
    expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
  });
});
