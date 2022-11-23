/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from '@testing-library/react-native';

/**
 * Render given JSX inside Naviagation container.
 * This should be used for rendering whole navigators as used by real app.
 */
export function renderNavigator(ui) {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
}

const Stack = createStackNavigator();

/**
 * Render given screen *component* (not JSX element) inside a stack navigator
 * passing given params object as route params.
 * */
export function renderScreenWithParams(component, params) {
  return render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TestScreen"
          component={component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
