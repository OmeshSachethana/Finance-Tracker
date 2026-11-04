import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders the title and content when open', () => {
    render(
      <Modal open onClose={() => {}} title="Add transaction">
        Form here
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Add transaction' })).toBeInTheDocument();
    expect(screen.getByText('Form here')).toBeInTheDocument();
  });

  it('calls onClose from the close button', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Edit">
        Body
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing inside when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Hidden">
        Secret
      </Modal>,
    );
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });
});
