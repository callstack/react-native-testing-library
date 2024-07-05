# Jotai

## Introduction

Jotai is a global state management library for React that uses an atomic approach to optimize
renders and solve issues like extra re-renders and the need for memoization. It scales from simple
state management to complex enterprise applications, offering utilities and extensions to enhance
the developer experience.

## To Do List Example

Let's assume we have a simple to-do list component that uses Jotai for state management. The
component has a list of to-dos and a button to add a new to-do to the list.

```tsx title=TodoList.tsx
import * as React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {atom, useAtom} from 'jotai';

export type TodoItem = {
  id: string;
  text: string;
};

export const todosAtom = atom<TodoItem[]>([]);

export function TodoList() {
  const [todos, setTodos] = useAtom(todosAtom);

  const handleAddTodo = () =>
    setTodos((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 11),
        text: 'Buy almond milk',
      },
    ]);

  if (!todos.length) {
    return <Text>No todos, start by adding one...</Text>;
  }

  return (
    <View>
      <FlatList
        data={todos}
        renderItem={({item}: { item: TodoItem }) => (
          <Text key={item.id} accessibilityLabel={'todo-item'}>
            {item.text}
          </Text>
        )}
      />
      <Pressable accessibilityRole="button" onPress={handleAddTodo}>
        <Text>Add a random to-do</Text>
      </Pressable>
    </View>
  );
}
```

## Starting with a Simple Test

We can test our TodoList component using React Native Testing Library's (RNTL) regular render
function. Although it is sufficient to test the empty state of the TodoList component, it is not
enough to test the component with initial todos present in the list.

```tsx title=TodoList.test.tsx
import * as React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {TodoItem, TodoList, todosAtom} from './TodoList';
import {renderWithAtoms} from './test-utils';

jest.useFakeTimers();
test('renders an empty to do list', () => {
  render(<TodoList/>);
  expect(screen.getByText(/no todos, start by adding one/i)).toBeOnTheScreen();
});
```

## Custom Render Function to populate Jotai Atoms with Initial Values

To test the TodoList component with initial todos, we need to be able to populate the todosAtom with
initial values. We can create a custom render function that uses Jotai's useHydrateAtoms hook to
hydrate the atoms with initial values. This function will accept the initial atoms and their
corresponding values as an argument.

```tsx title=test-utils.tsx
import * as React from 'react';
import {render} from '@testing-library/react-native';
import {useHydrateAtoms} from "jotai/utils";
import {IHydrateAtomsProps, InitialValues, IRenderWithAtomsOptions} from "./types";

/**
 * A wrapper component that hydrates Jotai atoms with initial values.
 *
 * @template T - The type of the initial values for the atoms.
 * @param initialValues - The initial values for the Jotai atoms.
 * @param children - The child components to render.
 * @returns The rendered children.

 */
function HydrateAtomsWrapper<T>({
  initialValues,
  children,
}: IHydrateAtomsProps<T>) {
  useHydrateAtoms(initialValues as unknown as InitialValues);
  return children;
}

/**
 * Renders a React component with Jotai atoms for testing purposes.
 *
 * @template T - The type of the initial values for the atoms.
 * @param component - The React component to render.
 * @param options - `@testing-library/react-native` (RNTL's render options including the initial atom values.
 * @returns RNTL's render result.
 */
export const renderWithAtoms = <T, >(
  component: React.ReactElement,
  options: IRenderWithAtomsOptions<T>,
) => {
  const {initialValues} = options;
  return render(component, {
    wrapper: ({children}: { children: React.JSX.Element }) => (
      <HydrateAtomsWrapper initialValues={initialValues}>
        {children}
      </HydrateAtomsWrapper>
    ),
    ...options,
  });
};
```

## Testing the TodoList Component with Initial Todos

We can now use the renderWithAtoms function to render the TodoList component with initial todos. The
initialValues object will contain the todosAtom and its initial value. We can then test the
component to ensure that the initial todos are rendered correctly.

:::info
In our test, we populated only one atom and its initial value, but you can add other Jotai atoms and their corresponding values to the initialValues array as needed.
:::

```tsx title=TodoList.test.tsx
import * as React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {TodoItem, TodoList, todosAtom} from './TodoList';
import {renderWithAtoms} from './test-utils';

jest.useFakeTimers();

const INITIAL_TODOS: TodoItem[] = [{id: '1', text: 'Buy bread'}];

test('renders a to do list with 1 items initially, and adds a new item', async () => {
  renderWithAtoms<TodoItem[]>(<TodoList/>, {
    initialValues: [
      [todosAtom, INITIAL_TODOS],
      // optional: add any other Jotai atoms and their corresponding initial values
    ],
  });
  // Check if the initial to-do is rendered and the length of the to-do list is 1
  expect(screen.getByText(/buy bread/i)).toBeOnTheScreen();
  expect(screen.getAllByLabelText('todo-item')).toHaveLength(1);

  const user = userEvent.setup();
  const addTodoButton = screen.getByRole('button', {name: /add a random to-do/i});
  // Add a new to-do to the list
  await user.press(addTodoButton);

  // Check if the new to-do is rendered and the length of the to-do list is 2
  expect(screen.getByText(/buy almond milk/i)).toBeOnTheScreen();
  expect(screen.getAllByLabelText('todo-item')).toHaveLength(2);
});
```

## Get To dos and Add Todo Outside React Components Example

In several cases, you might need to change an atom's state outside a React component. In our case,
we have a set of functions to get todos and set todos, which change the state of the todo list atom.

```tsx title=TodoList.tsx
import {atom, createStore, useAtom} from 'jotai';

export const todosAtom = atom<TodoItem[]>([]);

// ...
// Available for use outside react components
export const store = createStore();
export const getTodos = (): TodoItem[] => store.get(todosAtom);
export const addTodo = (newTodo: TodoItem) => {
  const todos = getTodos();
  store.set(todosAtom, [...todos, newTodo]);
};
```

## Testing the Get To dos and Add Todo Functions

You can test the `getTodos` and `addTodo` functions outside the React component's scope by setting
the initial to-do items in the store and then checking if the functions work as expected.
No special setup is required to test these functions, as `store.set` is available by default by
Jotai.

```tsx title=TodoList.test.tsx
import {addTodo, getTodos, store, todosAtom} from './TodoList';

//...

test("[outside react's scope] start with 1 initial todo and adds a new todo item", () => {
  // Set the initial to do items in the store
  store.set(todosAtom, INITIAL_TODOS);

  expect(getTodos()).toEqual(INITIAL_TODOS);
  const NEW_TODO = {id: '2', text: 'Buy almond milk'};
  addTodo({
    id: '2',
    text: 'Buy almond milk',
  });
  expect(getTodos()).toEqual([...INITIAL_TODOS, NEW_TODO]);
});
```

## Conclusion

Testing a component or a function that depends on Jotai atoms is straightforward with the help of
the useHydrateAtoms hook. We've seen how to create a custom render function renderWithAtoms that
sets up atoms and their initial values for testing purposes. We've also seen how to test functions
that change the state of atoms outside React components. This approach allows us to test components
in different states and scenarios, ensuring they behave as expected.
