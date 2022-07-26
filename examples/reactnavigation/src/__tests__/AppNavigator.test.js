import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

/** Render helper that renders `ui` within `NavigationContainer`. */
function renderWithNavigation(ui) {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
}

test('page contains the header and 10 items', async () => {
  renderWithNavigation(<AppNavigator />);

  const header = await screen.findByText('List of numbers from 1 to 20');
  expect(header).toBeTruthy();

  const items = screen.getAllByText(/Item number/);
  expect(items.length).toBe(10);
});

test('clicking on one item takes you to the details screen', async () => {
  renderWithNavigation(<AppNavigator />);

  const toClick = await screen.findByText('Item number 5');
  fireEvent(toClick, 'press');

  expect(screen.getByText('Showing details for 5')).toBeTruthy();
  expect(screen.getByText('the number you have chosen is 5')).toBeTruthy();
});
