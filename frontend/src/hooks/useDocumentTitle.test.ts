import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  it('prefixes the page name', () => {
    renderHook(() => useDocumentTitle('Budgets'));
    expect(document.title).toBe('Budgets · Finance Tracker');
  });

  it('uses the app name alone without a page', () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe('Finance Tracker');
  });
});
