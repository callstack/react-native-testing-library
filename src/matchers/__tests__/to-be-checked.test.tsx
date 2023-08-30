import React from 'react';
import { View } from 'react-native';
import render from '../../render';
import { screen } from '../../screen';
import '../extend-expect';

test('toBeCheck() with checkbox role', () => {
  render(
    <View
      testID="view"
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: true }}
    />
  );

  const view = screen.getByTestId('view');
  expect(view).toBeChecked();
});
