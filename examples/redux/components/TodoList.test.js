import * as React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react-native';
import configureStore from '../store';
import TodoList from './TodoList';

const initialState = {
  todos: [
    { id: 1, text: 'Sing something', date: new Date() },
    { id: 2, text: 'Dance something', date: new Date() },
    { id: 3, text: 'Sleep something', date: new Date() },
    { id: 4, text: 'Sleep something', date: new Date() },
  ],
};

test('it should execute with a store with 4 elements', () => {
  const store = configureStore(initialState);
  render(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );

  const todoElems = screen.getAllByText(/something/i);
  expect(todoElems.length).toEqual(4);
});

test('should execute with 2 elements and end up with 1 after delete', () => {
  const store = configureStore(initialState);
  render(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );

  const todoElems = screen.getAllByText(/something/i);
  expect(todoElems.length).toBe(4);

  const buttons = screen.getAllByText('Delete');
  expect(buttons.length).toBe(4);
  fireEvent.press(buttons[0]);

  const buttonsAfterDelete = screen.getAllByText('Delete');
  expect(buttonsAfterDelete.length).toBe(3);
});
