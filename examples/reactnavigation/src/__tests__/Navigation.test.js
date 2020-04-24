import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent, cleanup } from 'react-native-testing-library';

import Navigation from '../Navigation';

// Resolves the error in https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

describe('Testing react navigation', () => {
  afterEach(cleanup);

  test('page contains the header and 10 items', () => {
    const component = (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    const { getByText, getAllByText } = render(component);

    const header = getByText('List of numbers from 1 to 20');
    const items = getAllByText(/Item number/);

    expect(header).toBeTruthy();
    expect(items.length).toBe(10);
  });

  test('clicking on one item takes you to the details screen', async () => {
    const component = (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );

    const { getByText } = render(component);
    const toClick = getByText('Item number 5');

    fireEvent(toClick, 'press');
    const newHeader = getByText('Showing details for 5');
    const newBody = getByText('the number you have chosen is 5');

    expect(newHeader).toBeTruthy();
    expect(newBody).toBeTruthy();
  });
});
