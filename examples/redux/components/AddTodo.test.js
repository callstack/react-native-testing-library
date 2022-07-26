import * as React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react-native';
import configureStore from '../store';
import AddTodo from './AddTodo';

function renderWithRedux(ui, options) {
  const store = options?.store ?? configureStore(options?.initialState);
  const queries = render(<Provider store={store}>{ui}</Provider>);
  return { ...queries, store };
}

test('adds a new test when entry has been included', () => {
  const { store } = renderWithRedux(<AddTodo />);

  const input = screen.getByPlaceholderText(/repository/i);
  expect(input).toBeTruthy();

  const textToEnter = 'This is a random element';
  fireEvent.changeText(input, textToEnter);
  fireEvent.press(screen.getByText('Submit form'));

  const todosState = store.getState().todos;
  expect(todosState.length).toEqual(1);
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
