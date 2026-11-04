import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('marks the selected colour and reports changes', async () => {
    const onChange = vi.fn();
    render(<ColorPicker label="Colour" value="#6366f1" onChange={onChange} />);
    expect(screen.getByRole('radio', { name: '#6366f1' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: '#ef4444' }));
    expect(onChange).toHaveBeenCalledWith('#ef4444');
  });
});
