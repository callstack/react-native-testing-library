---
id: redux-integration
title: Redux Integration
---

This section deals with testing RN applications developed with Redux. We will be developing a simple TODO application capable of adding and removing an item. Once included, the timestamp is included.

## Setting up

Install the packages required for Redux and it up. For this example we will install `react-redux` and `redux`. We will then proceed to create our action creators (found in `./actions/todoActions.js`) and our reducers (found in `./reducers/index.js`)

```js
// ./actions.todoActions.js
export const actions = {
  ADD: '@ADD_TODO',
  REMOVE: '@REMOVE_TODO',
  MODIFY: '@MODIFY_TODO',
  CLEAR: '@CLEAR_TODO',
};

export const addTodo = (todo) => ({
  type: actions.ADD,
  payload: todo,
});

export const removeTodo = (id) => ({
  type: actions.REMOVE,
  payload: { id },
});

export const modifyTodo = (todo) => ({
  type: actions.MODIFY,
  payload: todo,
});

export const clearTodos = () => ({
  type: actions.CLEAR,
});
```

```js
// ./reducers/index.js
import { combineReducers } from 'redux';
import { actions } from '../actions/todoActions.js';

function todoReducer(state = [], action) {
  switch (action.type) {
    case actions.ADD:
      return state.concat(action.payload);

    case actions.REMOVE:
      return state.filter((todo) => todo.id !== action.payload.id);

    case actions.MODIFY:
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            ...action.payload,
          };
        }
      });

    case actions.CLEAR:
      return [];

    default:
      return state;
  }
}

export default combineReducers({
  todos,
});
```

We then proceed to create our store. Simply called `./store.js`

```js
import { createStore } from 'redux';
import reducers from './reducers';

const initialStore = {
  todos: [],
};

// We pass our initial store to allow us change our initial redux state during test.
export default function configureStore(initialState = initialStore) {
  return createStore(reducers, initialState);
}
```

Finally, we attach our providers to `App.js`. We also create two components, `<AddTodo/>` and `<TodoList/>` which are connected directly to redux to either read from the store or make changes to the store.

For `./components/AddTodo.js`

```jsx
// AddTodo is responsible for adding a TODO. It does this by dispatching the addTodo action creator.
import React from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTodo } from '../actions/todoActions';

export function AddTodo(props) {
  const [text, setText] = React.useState('');

  const submitForm = () => {
    const todo = {
      id: props.todoLength + 1,
      text,
      date: new Date(),
    };

    props.addTodo(todo);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter a text below to add a new todo</Text>
      <TextInput
        autoFocus
        value={text}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={submitForm}
        onChangeText={(t) => setText(t)}
        placeholder="Enter the name of the repository here"
      />

      <Button onPress={submitForm} title="Submit form" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 156,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 2,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    paddingVertical: 8,
    width: '100%',
    textAlign: 'center',
    borderRadius: 4,
  },
});

const mapStateToProps = ({ todos }) => ({
  todoLength: todos.length,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addTodo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddTodo);
```

For `./components/TodoList.js`

```jsx
// TodoList is responsible for reading from Redux. Each row has a button which when pressed dispatches the deleteTodo method
import React from 'react';
import { FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeTodo } from '../actions/todoActions';

function TodoElem({ todo, onDelete }) {
  return (
    <View style={styles.elemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{todo.text}</Text>
        <Text style={styles.date}>{new Date(todo.date).toDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => onDelete(todo.id)} title="Delete" />
      </View>
    </View>
  );
}

export function TodoList(props) {
  const onDeleteTodo = (id) => props.removeTodo(id);

  return (
    <FlatList
      data={props.todos}
      keyExtractor={(todo) => todo.id.toString()}
      renderItem={({ item }) => (
        <TodoElem todo={item} onDelete={onDeleteTodo} />
      )}
    />
  );
}

const mapStateToProps = (state) => ({
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ removeTodo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

For `./App.js`

```jsx
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <AddTodo />
        <TodoList />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },
});
```

## Setting up the tests

Now for the test part. The whole idea behind this is to test out the components that either dispatch actions on the redux store or read some data from the redux store. This means we will test `./components/TodoElem.js` and `./components/TodoList.js`. Thus we will create `./components/AddTodo.test.js` and `./components/TodoList.test.js`

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
