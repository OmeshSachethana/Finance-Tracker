import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from './Input';

describe('Field', () => {
  it('links the label to the input', () => {
    render(
      <Field label="Email">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('marks the input invalid and describes it with the error', () => {
    render(
      <Field label="Email" error="Enter a valid email">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email');
  });
});
