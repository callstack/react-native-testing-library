---
id: redux-integration
title: Redux Integration
---

This section deals with testing RN applications developed with Redux. We will be developing a simple TODO application capable of adding and removing an item. Once included, the timestamp is included.

## Setting up

An example of setting up can be found [here](https://github.com/callstack/react-native-testing-library/tree/master/examples/redux).

## Test cases

Our test is on the components that either dispatch actions on the redux store or read some data from the redux store. This means we will test `./components/TodoElem.js` and `./components/TodoList.js`. Thus we will create `./components/AddTodo.test.js` and `./components/TodoList.test.js`

For `./components/AddTodo.test.js`

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import configureStore from '../store';
import AddTodo from './AddTodo';

describe('AddTodo component test', () => {
  test('adds a new TODO when the button is pressed', () => {
    const store = configureStore();

    const component = (
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const { getByPlaceholder, getByText } = render(component);

    // There is a TextInput.
    // https://github.com/callstack/react-native-testing-library/blob/ae3d4af370487e1e8fedd8219f77225690aefc59/examples/redux/components/AddTodo.js#L24
    const input = getByPlaceholder(/repository/i);
    expect(input).toBeTruthy();

    const textToEnter = 'This is a random element';
    fireEvent.changeText(input, textToEnter);
    fireEvent.press(getByText('Submit form'));

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
});
```

For the `./components/TodoList.js`

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from 'react-native-testing-library';
import configureStore from '../store';
import TodoList from './TodoList';

describe('TodoList component test', () => {
  test('it should execute with a store with 4 elements', () => {
    const initialState = {
      todos: [
        { id: 1, text: 'Sing something', date: new Date() },
        { id: 2, text: 'Dance something', date: new Date() },
        { id: 3, text: 'Sleep something', date: new Date() },
        { id: 4, text: 'Sleep something', date: new Date() },
      ],
    };
    const store = configureStore(initialState);

    const component = (
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    const { getAllByText } = render(component);
    const todoElems = getAllByText(/something/i);

    expect(todoElems.length).toEqual(4);
  });

  test('should execute with 2 elements and end up with 1 after delete', () => {
    const initialState = {
      todos: [
        { id: 1, text: 'Sing something', date: new Date() },
        { id: 2, text: 'Dance something', date: new Date() },
      ],
    };
    const store = configureStore(initialState);

    const component = (
      <Provider store={store}>
        <TodoList />
      </Provider>
    );

    const { getAllByText } = render(component);
    const todoElems = getAllByText(/something/i);

    expect(todoElems.length).toBe(2);

    const buttons = getAllByText('Delete');
    expect(buttons.length).toBe(2);

    fireEvent.press(buttons[0]);
    expect(getAllByText('Delete').length).toBe(1);
  });
});
```

## Running tests

To run the tests, place a test script inside your package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

And run the test script with npm test or yarn test.
