import * as React from 'react';
import { TextInput, View } from 'react-native';
import { render, screen } from '../..';
import { getTextInputValue, isEditableTextInput } from '../text-input';

test('getTextInputValue basic test', () => {
  render(
    <View>
      <TextInput testID="value" value="text-a" />
      <TextInput testID="default-value" defaultValue="text-b" />
      <View testID="view" />
    </View>,
  );

  expect(getTextInputValue(screen.getByTestId('value'))).toBe('text-a');
  expect(getTextInputValue(screen.getByTestId('default-value'))).toBe('text-b');

  const view = screen.getByTestId('view');
  expect(() => getTextInputValue(view)).toThrowErrorMatchingInlineSnapshot(
    `"Element is not a "TextInput", but it has type "View"."`,
  );
});

test('isEditableTextInput basic test', () => {
  render(
    <View>
      <TextInput testID="default" />
      <TextInput testID="editable" editable={true} />
      <TextInput testID="non-editable" editable={false} />
      <View testID="view" />
    </View>,
  );

  expect(isEditableTextInput(screen.getByTestId('default'))).toBe(true);
  expect(isEditableTextInput(screen.getByTestId('editable'))).toBe(true);
  expect(isEditableTextInput(screen.getByTestId('non-editable'))).toBe(false);
  expect(isEditableTextInput(screen.getByTestId('view'))).toBe(false);
});
