# Zustand

## Introduction

Zustand is a small, unopinionated state management library for React. It exposes a hook-based API
with a vanilla store underneath, so you can read and update state both inside and outside of React
components without requiring a provider.

## Task List Example

Let's assume we have a simple task list component that uses Zustand for state management. The
component has a list of tasks, a text input for typing a new task name, and a button to add a new
task to the list.

```tsx title=state-management/zustand/TaskList.tsx
import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { nanoid } from 'nanoid';
import { useTaskStore } from './state';

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const newTaskTitle = useTaskStore((state) => state.newTaskTitle);
  const setNewTaskTitle = useTaskStore((state) => state.setNewTaskTitle);
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = () => {
    addTask({
      id: nanoid(),
      title: newTaskTitle,
    });
  };

  return (
    <View>
      {tasks.map((task) => (
        <Text key={task.id} testID="task-item">
          {task.title}
        </Text>
      ))}

      {!tasks.length ? <Text>No tasks, start by adding one...</Text> : null}

      <TextInput
        accessibilityLabel="New Task"
        placeholder="New Task..."
        value={newTaskTitle}
        onChangeText={(text) => setNewTaskTitle(text)}
      />

      <Pressable accessibilityRole="button" onPress={handleAddTask}>
        <Text>Add Task</Text>
      </Pressable>
    </View>
  );
}
```

## Starting with a Simple Test

We can test our `TaskList` component using React Native Testing Library's (RNTL) regular `render`
function. Although it is sufficient to test the empty state of the `TaskList` component, shared
module-level Zustand stores keep state between tests, so we need a bit more setup for non-empty
scenarios.

```tsx title=state-management/zustand/__tests__/TaskList.test.tsx
import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { renderWithStore } from './test-utils';
import { TaskList } from '../TaskList';
import { useTaskStore } from '../state';
import { Task } from '../types';

jest.useFakeTimers();

afterEach(() => {
  useTaskStore.getState().reset();
});

test('renders an empty task list', async () => {
  await render(<TaskList />);
  expect(screen.getByText(/no tasks, start by adding one/i)).toBeOnTheScreen();
});
```

## Custom Render Function to Populate the Zustand Store

To test the `TaskList` component with initial tasks, create a custom render helper that resets the
store and applies an optional `initialState` with `setState`. Resetting in the helper (and in
`afterEach`) keeps tests isolated despite the module-level store.

```tsx title=state-management/zustand/__tests__/test-utils.tsx
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { useTaskStore } from '../state';
import { Task } from '../types';

export type TaskStoreInitialState = {
  tasks?: Task[];
  newTaskTitle?: string;
};

export interface RenderWithStoreOptions {
  initialState?: TaskStoreInitialState;
}

/**
 * Renders a React component with a Zustand store hydrated for testing.
 *
 * Resets the store before each render so tests stay isolated, then optionally
 * applies `initialState` via `setState`.
 */
export async function renderWithStore(
  component: React.ReactElement,
  options: RenderWithStoreOptions = {},
) {
  useTaskStore.getState().reset();

  if (options.initialState) {
    useTaskStore.setState(options.initialState);
  }

  return await render(component);
}
```

## Testing the `TaskList` Component with Initial Tasks

We can now use the `renderWithStore` function to render the `TaskList` component with initial tasks.

```tsx title=state-management/zustand/__tests__/TaskList.test.tsx
const INITIAL_TASKS: Task[] = [{ id: '1', title: 'Buy bread' }];

test('renders a to do list with 1 items initially, and adds a new item', async () => {
  await renderWithStore(<TaskList />, {
    initialState: {
      tasks: INITIAL_TASKS,
      newTaskTitle: '',
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
```

## Modifying the Store Outside of React Components

Zustand exposes `getState` / `setState` on the store hook, so selectors and actions can run outside
React without extra setup.

```tsx title=state-management/zustand/state.ts
import { create } from 'zustand';
import { Task } from './types';

type TaskState = {
  tasks: Task[];
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  addTask: (task: Task) => void;
  reset: () => void;
};

const initialState = {
  tasks: [] as Task[],
  newTaskTitle: '',
};

export const useTaskStore = create<TaskState>((set) => ({
  ...initialState,
  setNewTaskTitle: (newTaskTitle) => set({ newTaskTitle }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
      newTaskTitle: '',
    })),
  reset: () => set(initialState),
}));

// Selectors / actions available outside React components
export function getAllTasks(): Task[] {
  return useTaskStore.getState().tasks;
}

export function addTask(task: Task) {
  useTaskStore.getState().addTask(task);
}
```

## Testing the Store Outside of React Components

You can test `getAllTasks` and `addTask` by setting initial state on the store and asserting on
`getState` results.

```tsx title=state-management/zustand/__tests__/TaskList.test.tsx
import { addTask, getAllTasks, useTaskStore } from '../state';

//...

test('modify store outside of components', () => {
  useTaskStore.setState({ tasks: INITIAL_TASKS });
  expect(getAllTasks()).toEqual(INITIAL_TASKS);

  const NEW_TASK = { id: '2', title: 'Buy almond milk' };
  addTask(NEW_TASK);
  expect(getAllTasks()).toEqual([...INITIAL_TASKS, NEW_TASK]);
});
```

## Conclusion

Testing components that use Zustand is straightforward with a small `renderWithStore` helper that
resets the module store and hydrates initial state via `setState`. The same store API works outside
React, so you can cover selectors and actions without mounting a component tree.
