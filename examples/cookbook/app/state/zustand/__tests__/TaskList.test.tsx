import * as React from 'react';
import { screen, userEvent } from '@testing-library/react-native';
import TaskList from '../TaskList';
import { renderWithState } from '../test-utils';
import { Task } from '../types';

jest.useFakeTimers();

test('renders an empty task list', () => {
  renderWithState(<TaskList />);
  expect(screen.getByText(/no tasks, start by adding one/i)).toBeOnTheScreen();
});

const INITIAL_TASKS: Task[] = [{ id: '1', title: 'Buy bread', completed: false }];

test('renders a to do list with 1 items initially, and adds a new item', async () => {
  renderWithState(<TaskList />, {
    initialState: {
      tasks: INITIAL_TASKS,
    },
  });

  expect(screen.getByText(/buy bread/i)).toBeOnTheScreen();
  expect(screen.getAllByTestId('task-item')).toHaveLength(1);

  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText(/new task/i), 'Buy almond milk');
  await user.press(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText(/buy almond milk/i)).toBeOnTheScreen();
  expect(screen.getAllByTestId('task-item')).toHaveLength(2);
});
