import { fireEvent, render } from '@testing-library/react';
import { useHotkey } from './useHotkey';

function Harness({ onHit }: { onHit: () => void }) {
  useHotkey('n', onHit);
  return <input aria-label="field" />;
}

describe('useHotkey', () => {
  it('fires on the key', () => {
    const onHit = vi.fn();
    render(<Harness onHit={onHit} />);
    fireEvent.keyDown(window, { key: 'n' });
    expect(onHit).toHaveBeenCalledOnce();
  });

  it('ignores the key while typing in a field', () => {
    const onHit = vi.fn();
    const { getByLabelText } = render(<Harness onHit={onHit} />);
    fireEvent.keyDown(getByLabelText('field'), { key: 'n' });
    expect(onHit).not.toHaveBeenCalled();
  });

  it('ignores modifier combinations', () => {
    const onHit = vi.fn();
    render(<Harness onHit={onHit} />);
    fireEvent.keyDown(window, { key: 'n', ctrlKey: true });
    expect(onHit).not.toHaveBeenCalled();
  });
});
