import React from 'react';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import App from './App';

describe('Application test', () => {
  afterEach(cleanup);

  test('testing redux functionality', () => {
    const component = <App />;
    const { getByPlaceholder, getByText, getAllByText } = render(component);
    const input = getByPlaceholder('Enter the name of the repository here');
    expect(input).toBeTruthy();

    const textEntered = 'Test input';
    const secondEntered = 'Second test input';

    // Enter two entries
    fireEvent.changeText(input, textEntered);
    fireEvent.press(getByText('Submit form'));

    fireEvent.changeText(input, secondEntered);
    fireEvent.press(getByText('Submit form'));

    const buttons = getAllByText('Delete');
    expect(buttons.length).toBe(2);

    expect(getByText(textEntered)).toBeTruthy();
    expect(getByText(secondEntered)).toBeTruthy();

    // Delete the second button
    fireEvent.press(buttons[0]);
    expect(getAllByText('Delete').length).toBe(1);
  });
});
