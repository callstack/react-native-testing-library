import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '../..';
import { formatElement } from '../format-element';

test('formatElement', () => {
  render(
    <View testID="root">
      <View testID="view" />
      <Text>Hello</Text>
    </View>,
  );

  expect(formatElement(screen.getByTestId('view'))).toMatchInlineSnapshot(`
    "<View
      testID="view"
    />"
  `);
  expect(formatElement(screen.getByText('Hello'))).toMatchInlineSnapshot(`
    "<Text>
      Hello
    </Text>"
  `);
  expect(formatElement(null)).toMatchInlineSnapshot(`"(null)"`);
});
