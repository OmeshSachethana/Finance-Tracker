import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes its value to assistive tech', () => {
    render(<ProgressBar value={42} label="Budget used" />);
    expect(screen.getByRole('progressbar', { name: 'Budget used' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
  });

  it('caps the visual width at 100%', () => {
    render(<ProgressBar value={140} label="Over budget" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });
});
