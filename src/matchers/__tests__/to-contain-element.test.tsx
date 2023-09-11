import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toContainElement() on parent view', () => {
  render(
    <View testID="parent">
      <View testID="child" />
    </View>
  );

  const parent = screen.getByTestId('parent');
  const child = screen.getByTestId('child');

  expect(parent).toContainElement(child);

  expect(() => expect(parent).not.toContainElement(child))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toContainElement(element)

      <View
        children={
          <View
            testID="child"
          />
        }
        testID="parent"
      /> 

    contains:

       <View
        testID="child"
      />
            "
  `);
});
