import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { renderWithAtoms } from './test-utils';
import { TodoList } from './TodoList';
import { addTodo, getTodos, store, todosAtom } from './state';
import { TodoItem } from './types';

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
  expect(screen.getAllByTestId('todo-item')).toHaveLength(1);

  const user = userEvent.setup();
  const addTodoButton = screen.getByRole('button', { name: /add a random to-do/i });
  await user.press(addTodoButton);

  expect(screen.getByText(/buy almond milk/i)).toBeOnTheScreen();
  expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
});

test("[outside react's scope]start with 1 initial todo and adds a new todo item", () => {
  // Set the initial to do items in the store
  store.set(todosAtom, INITIAL_TODOS);

  expect(getTodos()).toEqual(INITIAL_TODOS);
  const NEW_TODO = { id: '2', text: 'Buy almond milk' };
  addTodo({
    id: '2',
    text: 'Buy almond milk',
  });
  expect(getTodos()).toEqual([...INITIAL_TODOS, NEW_TODO]);
});
