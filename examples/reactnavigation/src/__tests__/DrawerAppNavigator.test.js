import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

import DrawerAppNavigator from '../DrawerAppNavigator';

describe('Testing react navigation', () => {
  test('screen contains a button linking to the notifications page', async () => {
    const component = (
      <NavigationContainer>
        <DrawerAppNavigator />
      </NavigationContainer>
    );

    const { findByText, findAllByText } = render(component);
    const button = await findByText('Go to notifications');

    expect(button).toBeTruthy();
  });

  test('clicking on the button takes you to the notifications screen', async () => {
    const component = (
      <NavigationContainer>
        <DrawerAppNavigator />
      </NavigationContainer>
    );

    const { queryByText, findByText } = render(component);
    const oldScreen = queryByText('Welcome!');
    const button = await findByText('Go to notifications');

    expect(oldScreen).toBeTruthy();

    fireEvent(button, 'press');
    const newScreen = await findByText('This is the notifications screen');

    expect(newScreen).toBeTruthy();
  });
});
