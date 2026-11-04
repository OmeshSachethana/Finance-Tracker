import { createElement } from 'react';
import { categoryIcon } from './icons';

export function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${color}1f`, color }}
    >
      {createElement(categoryIcon(icon), { className: 'size-4.5' })}
    </span>
  );
}
