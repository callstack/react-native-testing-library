import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('.toBeSelected() basic case', () => {
  render(
    <View>
      <View testID="selected" accessibilityState={{ selected: true }} />
      <View testID="not-selected" accessibilityState={{ selected: false }} />
      <View testID="no-accessibilityState" />
    </View>
  );

  expect(screen.getByTestId('selected')).toBeSelected();
  expect(screen.getByTestId('not-selected')).not.toBeSelected();
  expect(screen.getByTestId('no-accessibilityState')).not.toBeSelected();
});

test('.toBeSelected() error messages', () => {
  render(
    <View>
      <View testID="selected" accessibilityState={{ selected: true }} />
      <View testID="not-selected" accessibilityState={{ selected: false }} />
      <View testID="no-accessibilityState" />
    </View>
  );

  expect(() => expect(screen.getByTestId('not-selected')).toBeSelected())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeSelected()

    Received element is not selected
      <View
        accessibilityState={
          {
            "selected": false,
          }
        }
        testID="not-selected"
      />"
  `);
  expect(() => expect(screen.getByTestId('selected')).not.toBeSelected())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeSelected()

    Received element is selected
      <View
        accessibilityState={
          {
            "selected": true,
          }
        }
        testID="selected"
      />"
  `);
  expect(() =>
    expect(screen.getByTestId('no-accessibilityState')).toBeSelected()
  ).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeSelected()

    Received element is not selected
      <View
        testID="no-accessibilityState"
      />"
  `);
});
