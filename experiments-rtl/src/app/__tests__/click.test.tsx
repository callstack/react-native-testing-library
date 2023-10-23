import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('userEvent.click()', async () => {
  const handleClick = jest.fn();

  render(
    <button onClick={handleClick} disabled={false}>
      Click
    </button>
  );

  const button = screen.getByText('Click');
  await userEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('fireEvent.click()', () => {
  const handleClick = jest.fn();

  render(
    <button onClick={handleClick} disabled={false}>
      Click
    </button>
  );

  const button = screen.getByText('Click');
  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
