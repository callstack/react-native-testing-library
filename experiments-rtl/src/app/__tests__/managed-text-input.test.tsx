import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface ManagedInputProps {
  defaultValue?: string;
  disabled?: boolean;
}

function ManagedInput({ defaultValue, ...props }: ManagedInputProps) {
  const [value, setValue] = React.useState(defaultValue ?? '');

  return (
    <input type="text" value={value} onChange={(e) => setValue(e.currentTarget.value)} {...props} />
  );
}

test('userEvent.type()', async () => {
  render(<ManagedInput data-testid="input" defaultValue="Hello" disabled={false} />);

  const input = screen.getByTestId('input');
  await userEvent.type(input, ' World');
  expect(input).toHaveValue('Hello World');
});

test('userEvent.clear()', async () => {
  render(<ManagedInput data-testid="input" defaultValue="Hello" disabled={false} />);

  const input = screen.getByTestId('input');
  await userEvent.clear(input);
  expect(input).toHaveValue('');
});

test('fireEvent.change()', () => {
  render(<ManagedInput data-testid="input" defaultValue="Hello" disabled={false} />);

  const input = screen.getByTestId('input');
  fireEvent.change(input, { target: { value: 'World' } });
  expect(input).toHaveValue('World');
});
