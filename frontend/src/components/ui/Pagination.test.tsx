import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('disables previous on the first page', () => {
    render(<Pagination page={1} totalPages={3} total={50} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('moves to the next page', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={3} total={50} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
