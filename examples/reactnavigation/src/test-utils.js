/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

/** Render helper that renders `ui` within `NavigationContainer`. */
export function renderWithNavigation(ui) {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
}
