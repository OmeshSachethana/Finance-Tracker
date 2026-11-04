import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { useTransactionQuery } from './useTransactionQuery';

function wrapper(initial: string) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  );
}

describe('useTransactionQuery', () => {
  it('reads filters and page from the URL', () => {
    const { result } = renderHook(() => useTransactionQuery(), {
      wrapper: wrapper('/transactions?type=income&page=3'),
    });
    expect(result.current.query).toEqual({ type: 'income', page: 3 });
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('resets to page 1 when a filter changes', () => {
    const { result } = renderHook(() => useTransactionQuery(), {
      wrapper: wrapper('/transactions?page=3'),
    });
    act(() => result.current.update({ search: 'coffee' }));
    expect(result.current.query).toEqual({ search: 'coffee', page: 1 });
  });

  it('removes empty values', () => {
    const { result } = renderHook(() => useTransactionQuery(), {
      wrapper: wrapper('/transactions?search=coffee'),
    });
    act(() => result.current.update({ search: '' }));
    expect(result.current.query).toEqual({ page: 1 });
  });
});
