import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    const hidden = false;
    expect(cn('a', hidden && 'b', 'c')).toBe('a c');
  });

  it('lets later Tailwind classes win', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
