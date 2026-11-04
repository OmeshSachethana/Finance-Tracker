import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from './TransactionForm';

vi.mock('@/features/categories/api', () => ({
  useCategories: () => ({
    data: [
      { id: 'c-food', name: 'Groceries', type: 'expense', color: '#000000', icon: 'x' },
      { id: 'c-pay', name: 'Salary', type: 'income', color: '#000000', icon: 'x' },
    ],
  }),
}));

vi.mock('@/features/accounts/api', () => ({
  useAccounts: () => ({
    data: [{ id: 'a-cash', name: 'Cash', archived: false }],
  }),
}));

vi.mock('@/hooks/useMoney', () => ({
  useMoney: () => ({ currency: 'USD', format: (n: number) => String(n) }),
}));

describe('TransactionForm', () => {
  it('submits amounts in minor units with parsed tags', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TransactionForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText('Amount (USD)'), '42.50');
    await userEvent.type(screen.getByLabelText('Description'), 'Weekly shop');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'c-food');
    await userEvent.type(screen.getByLabelText('Tags'), 'home, food');
    await userEvent.click(screen.getByRole('button', { name: 'Add transaction' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'expense',
        amount: 4250,
        description: 'Weekly shop',
        categoryId: 'c-food',
        accountId: 'a-cash',
        tags: ['home', 'food'],
      }),
    );
  });

  it('only offers categories for the selected type', async () => {
    render(<TransactionForm onSubmit={vi.fn()} onCancel={() => {}} />);
    expect(screen.queryByRole('option', { name: 'Salary' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'income' }));
    expect(screen.getByRole('option', { name: 'Salary' })).toBeInTheDocument();
  });

  it('shows errors for missing fields', async () => {
    const onSubmit = vi.fn();
    render(<TransactionForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add transaction' }));
    expect(await screen.findByText('Amount is required')).toBeInTheDocument();
    expect(screen.getByText('Choose a category')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects invalid amounts', async () => {
    const onSubmit = vi.fn();
    render(<TransactionForm onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText('Amount (USD)'), '12.345');
    await userEvent.type(screen.getByLabelText('Description'), 'Test');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'c-food');
    await userEvent.click(screen.getByRole('button', { name: 'Add transaction' }));
    expect(await screen.findByText('Enter a positive amount like 12.50')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
