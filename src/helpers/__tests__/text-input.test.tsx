import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import { getTextInputValue, isTextInputEditable } from '../text-input';

test('getTextInputValue() throws error when invoked on non-text input', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');
  expect(() => getTextInputValue(view)).toThrowErrorMatchingInlineSnapshot(
    `"Element is not a "TextInput", but it has type "View"."`
  );
});

test('isTextInputEditable() throws error when invoked on non-text input', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');
  expect(() => isTextInputEditable(view)).toThrowErrorMatchingInlineSnapshot(
    `"Element is not a "TextInput", but it has type "View"."`
  );
});
