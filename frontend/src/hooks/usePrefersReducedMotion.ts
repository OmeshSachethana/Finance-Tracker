import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  const media = window.matchMedia?.(QUERY);
  media?.addEventListener('change', callback);
  return () => media?.removeEventListener('change', callback);
}

/** True when the user has asked the OS to minimise animation. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(QUERY).matches ?? false,
    () => false,
  );
}
