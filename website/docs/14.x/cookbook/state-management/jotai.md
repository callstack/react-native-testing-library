# Jotai

## Introduction

Jotai is a global state management library for React that uses an atomic approach to optimize
renders and solve issues like extra re-renders and the need for memoization. It scales from simple
state management to complex enterprise applications, offering utilities and extensions to enhance
the developer experience.

## Task List Example

Let's assume we have a simple task list component that uses Jotai for state management. The
component has a list of tasks, a text input for typing new task name and a button to add a new task to the list.

```tsx title=state-management/jotai/TaskList.tsx
import * as React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAtom } from 'jotai';
import { nanoid } from 'nanoid';
import { newTaskTitleAtom, tasksAtom } from './state';

export function TaskList() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [newTaskTitle, setNewTaskTitle] = useAtom(newTaskTitleAtom);

  const handleAddTask = () => {
    setTasks((tasks) => [
      ...tasks,
      {
        id: nanoid(),
        title: newTaskTitle,
      },
    ]);
    setNewTaskTitle('');
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
function. Although it is sufficient to test the empty state of the `TaskList` component, it is not
enough to test the component with initial tasks present in the list.

```tsx title=status-management/jotai/__tests__/TaskList.test.tsx
import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { renderWithAtoms } from './test-utils';
import { TaskList } from './TaskList';
import { newTaskTitleAtom, tasksAtom } from './state';
import { Task } from './types';

jest.useFakeTimers();

test('renders an empty task list', () => {
  render(<TaskList />);
  expect(screen.getByText(/no tasks, start by adding one/i)).toBeOnTheScreen();
});
```

## Custom Render Function to populate Jotai Atoms with Initial Values

To test the `TaskList` component with initial tasks, we need to be able to populate the `tasksAtom` with
initial values. We can create a custom render function that uses Jotai's `useHydrateAtoms` hook to
hydrate the atoms with initial values. This function will accept the initial atoms and their
corresponding values as an argument.

```tsx title=status-management/jotai/test-utils.tsx
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { useHydrateAtoms } from 'jotai/utils';
import { PrimitiveAtom } from 'jotai/vanilla/atom';

// Jotai types are not well exported, so we will make our life easier by using `any`.
export type AtomInitialValueTuple<T> = [PrimitiveAtom<T>, T];

export interface RenderWithAtomsOptions {
  initialValues: AtomInitialValueTuple<any>[];
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @param component - The React component to render.
 * @param options - The render options including the initial atom values.
 * @returns The render result from `@testing-library/react-native`.
 */
export const renderWithAtoms = <T,>(
  component: React.ReactElement,
  options: RenderWithAtomsOptions
) => {
  return render(
    <HydrateAtomsWrapper initialValues={options.initialValues}>{component}</HydrateAtomsWrapper>
  );
};

export type HydrateAtomsWrapperProps = React.PropsWithChildren<{
  initialValues: AtomInitialValueTuple<unknown>[];
}>;

/**
 * A wrapper component that hydrates Jotai atoms with initial values.
 *
 * @param initialValues - The initial values for the Jotai atoms.
 * @param children - The child components to render.
 * @returns The rendered children.

 */
function HydrateAtomsWrapper({ initialValues, children }: HydrateAtomsWrapperProps) {
  useHydrateAtoms(initialValues);
  return children;
}
```

## Testing the `TaskList` Component with initial tasks

We can now use the `renderWithAtoms` function to render the `TaskList` component with initial tasks. The
`initialValues` property will contain the `tasksAtom`, `newTaskTitleAtom` and their initial values. We can then test the component to ensure that the initial tasks are rendered correctly.

:::info
In our test, we populated only one atom and its initial value, but you can add other Jotai atoms and their corresponding values to the initialValues array as needed.
:::

```tsx title=status-management/jotai/__tests__/TaskList.test.tsx
=======
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
```

## Modifying atom outside of React components

In several cases, you might need to change an atom's state outside a React component. In our case,
we have a set of functions to get tasks and set tasks, which change the state of the task list atom.

```tsx title=state-management/jotai/state.ts
import { atom, createStore } from 'jotai';
import { Task } from './types';

export const tasksAtom = atom<Task[]>([]);
export const newTaskTitleAtom = atom('');

// Available for use outside React components
export const store = createStore();

// Selectors
export function getAllTasks(): Task[] {
  return store.get(tasksAtom);
}

// Actions
export function addTask(task: Task) {
  store.set(tasksAtom, [...getAllTasks(), task]);
}
```

## Testing atom outside of React components

You can test the `getAllTasks` and `addTask` functions outside the React component's scope by setting
the initial to-do items in the store and then checking if the functions work as expected.
No special setup is required to test these functions, as `store.set` is available by default by
Jotai.

```tsx title=state-management/jotai/__tests__/TaskList.test.tsx
import { addTask, getAllTasks, store, tasksAtom } from './state';

//...

test('modify store outside of React component', () => {
  // Set the initial to do items in the store
  store.set(tasksAtom, INITIAL_TASKS);
  expect(getAllTasks()).toEqual(INITIAL_TASKS);

  const NEW_TASK = { id: '2', title: 'Buy almond milk' };
  addTask(NEW_TASK);
  expect(getAllTasks()).toEqual([...INITIAL_TASKS, NEW_TASK]);
});
```

## Conclusion

Testing a component or a function that depends on Jotai atoms is straightforward with the help of
the `useHydrateAtoms` hook. We've seen how to create a custom render function `renderWithAtoms` that
sets up atoms and their initial values for testing purposes. We've also seen how to test functions
that change the state of atoms outside React components. This approach allows us to test components
in different states and scenarios, ensuring they behave as expected.
