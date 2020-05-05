import React from 'react';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import configureStore from '../store';
import AddTodo from './AddTodo';

describe('Application test', () => {
  afterEach(cleanup);

  test('adds a new test when entry has been included', () => {
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
