import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithRedux } from '../test-utils';
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
  renderWithRedux(<TodoList />, { initialState });

  const todoElems = screen.getAllByText(/something/i);
  expect(todoElems).toHaveLength(4);
});

test('should display 4 elements and end up with 3 after delete', () => {
  renderWithRedux(<TodoList />, { initialState });

  const todoElems = screen.getAllByText(/something/i);
  expect(todoElems.length).toBe(4);

  const buttons = screen.getAllByText('Delete');
  expect(buttons).toHaveLength(4);
  fireEvent.press(buttons[0]);

  const buttonsAfterDelete = screen.getAllByText('Delete');
  expect(buttonsAfterDelete).toHaveLength(3);
});
