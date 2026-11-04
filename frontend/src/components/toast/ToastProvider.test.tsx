import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Trigger() {
  const toast = useToast();
  return <button onClick={() => toast('Saved!')}>Save</button>;
}

describe('ToastProvider', () => {
  it('shows a toast and hides it after a delay', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('can be dismissed', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });
});
