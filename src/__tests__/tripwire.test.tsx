import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '..';
import { getHostSelf } from '../helpers/component-tree';

test('React Native tripwire: <View> renders single host element', () => {
  const view = render(<View testID="test" />);
  const hostView = view.getByTestId('test');
  expect(getHostSelf(hostView)).toBe(hostView);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="test"
    />
  `);
});

test('React Native tripwire: <Text> renders single host element', () => {
  const view = render(<Text testID="test">Hello</Text>);
  const compositeView = view.getByText('Hello');
  const hostView = view.getByTestId('test');
  expect(getHostSelf(compositeView)).toBe(hostView);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Text
      testID="test"
    >
      Hello
    </Text>
  `);
});

test('React Native tripwire: <TextInput> renders single host element', () => {
  const view = render(
    <TextInput
      testID="test"
      defaultValue="default"
      value="currentValue"
      placeholder="Placeholder"
    />
  );
  const compositeView = view.getByPlaceholderText('Placeholder');
  const hostView = view.getByTestId('test');
  expect(getHostSelf(compositeView)).toBe(hostView);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <TextInput
      defaultValue="default"
      placeholder="Placeholder"
      testID="test"
      value="currentValue"
    />
  `);
});
