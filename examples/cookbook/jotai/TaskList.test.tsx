import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { renderWithAtoms } from './test-utils';
import { TaskList } from './TaskList';
import { addTask, getAllTasks, newTaskTitleAtom, store, tasksAtom } from './state';
import { Task } from './types';

jest.useFakeTimers();

test('renders an empty task list', () => {
  render(<TaskList />);
  expect(screen.getByText(/no tasks, start by adding one/i)).toBeOnTheScreen();
});

const INITIAL_TASKS: Task[] = [{ id: '1', title: 'Buy bread' }];

test('renders a to do list with 1 items initially, and adds a new item', async () => {
  renderWithAtoms(<TaskList />, {
    initialValues: [
      [tasksAtom, INITIAL_TASKS],
      [newTaskTitleAtom, ''],
    ],
  });

  expect(screen.getByText(/buy bread/i)).toBeOnTheScreen();
  expect(screen.getAllByTestId('task-item')).toHaveLength(1);

  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText(/new task/i), 'Buy almond milk');
  await user.press(screen.getByRole('button', { name: /add task/i }));

  expect(screen.getByText(/buy almond milk/i)).toBeOnTheScreen();
  expect(screen.getAllByTestId('task-item')).toHaveLength(2);
});

test('modify store outside of components', () => {
  // Set the initial to do items in the store
  store.set(tasksAtom, INITIAL_TASKS);
  expect(getAllTasks()).toEqual(INITIAL_TASKS);

  const NEW_TASK = { id: '2', title: 'Buy almond milk' };
  addTask(NEW_TASK);
  expect(getAllTasks()).toEqual([...INITIAL_TASKS, NEW_TASK]);
});
