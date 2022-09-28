import * as React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '..';
import { getHostSelf } from '../helpers/component-tree';

/**
 * Tests in this file are intended to give us an proactive warning that React Native behavior has
 * changed in a way that may impact our code like queries or event handling.
 */

test('React Native API assumption: <View> renders single host element', () => {
  const view = render(<View testID="test" />);
  const hostView = view.getByTestId('test');
  expect(getHostSelf(hostView)).toBe(hostView);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="test"
    />
  `);
});

test('React Native API assumption: <Text> renders single host element', () => {
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

test('React Native API assumption: nested <Text> renders single host element', () => {
  const view = render(
    <Text testID="test">
      <Text testID="before">Before</Text>
      Hello
      <Text testID="after">
        <Text testID="deeplyNested">Deeply nested</Text>
      </Text>
    </Text>
  );
  expect(getHostSelf(view.getByText('Hello'))).toBe(view.getByTestId('test'));
  expect(getHostSelf(view.getByText('Before'))).toBe(
    view.getByTestId('before')
  );
  expect(getHostSelf(view.getByText('Deeply nested'))).toBe(
    view.getByTestId('deeplyNested')
  );

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Text
      testID="test"
    >
      <Text
        testID="before"
      >
        Before
      </Text>
      Hello
      <Text
        testID="after"
      >
        <Text
          testID="deeplyNested"
        >
          Deeply nested
        </Text>
      </Text>
    </Text>
  `);
});

test('React Native API assumption: <TextInput> renders single host element', () => {
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
