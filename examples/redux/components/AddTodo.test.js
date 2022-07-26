import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithRedux } from '../test-utils';
import AddTodo from './AddTodo';

test('adds a new todo to redux store when submitting form', () => {
  const { store } = renderWithRedux(<AddTodo />);

  const input = screen.getByPlaceholderText(/repository/i);
  expect(input).toBeTruthy();

  const textToEnter = 'This is a random element';
  fireEvent.changeText(input, textToEnter);
  fireEvent.press(screen.getByText('Submit form'));

  const todosState = store.getState().todos;
  expect(todosState).toHaveLength(1);
  expect(todosState).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 1,
        text: textToEnter,
        date: expect.any(Date),
      }),
    ])
  );
});
