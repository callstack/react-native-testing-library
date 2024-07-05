import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { TodoItem, TodoList, todosAtom } from './TodoList';
import { renderWithAtoms } from './test-utils';

jest.useFakeTimers();
test('renders an empty to do list', () => {
  render(<TodoList />);
  expect(screen.getByText(/no todos, start by adding one/i)).toBeOnTheScreen();
});

const INITIAL_TODOS: TodoItem[] = [{ id: '1', text: 'Buy bread' }];

test('renders a to do list with 1 items initially, and adds a new item', async () => {
  renderWithAtoms<TodoItem[]>(<TodoList />, {
    initialValues: [
      [todosAtom, INITIAL_TODOS],
      // optional: add any other Jotai atoms and their corresponding initial values
    ],
  });
  expect(screen.getByText(/buy bread/i)).toBeOnTheScreen();
  expect(screen.getAllByLabelText('todo-item')).toHaveLength(1);

  const user = userEvent.setup();
  const addTodoButton = screen.getByRole('button', { name: /add a random to-do/i });
  await user.press(addTodoButton);

  expect(screen.getByText(/buy almond milk/i)).toBeOnTheScreen();
  expect(screen.getAllByLabelText('todo-item')).toHaveLength(2);
});
