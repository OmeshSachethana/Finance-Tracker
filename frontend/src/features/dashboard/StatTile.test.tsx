import { render, screen } from '@testing-library/react';
import { Wallet } from 'lucide-react';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('shows the value and change', () => {
    render(<StatTile label="Income" value="$4,500.00" icon={Wallet} change={12.4} />);
    expect(screen.getByText('$4,500.00')).toBeInTheDocument();
    expect(screen.getByText('12% vs last month')).toHaveClass('text-emerald-700');
  });

  it('treats rising expenses as bad', () => {
    render(
      <StatTile label="Expenses" value="$900" icon={Wallet} change={20} higherIsBetter={false} />,
    );
    expect(screen.getByText('20% vs last month')).toHaveClass('text-red-600');
  });

  it('hides the change when there is nothing to compare', () => {
    render(<StatTile label="Income" value="$0" icon={Wallet} change={null} />);
    expect(screen.queryByText(/vs last month/)).not.toBeInTheDocument();
  });
});
