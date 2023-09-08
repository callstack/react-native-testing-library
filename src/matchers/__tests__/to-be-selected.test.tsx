import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('.toBeSelected() basic case', () => {
  render(
    <>
      <View testID="selected" accessibilityState={{ selected: true }} />
      <View testID="selected-aria" aria-selected />
      <View testID="not-selected" accessibilityState={{ selected: false }} />
      <View testID="not-selected-aria" aria-selected={false} />
      <View testID="default" />
    </>
  );

  expect(screen.getByTestId('selected')).toBeSelected();
  expect(screen.getByTestId('selected-aria')).toBeSelected();
  expect(screen.getByTestId('not-selected')).not.toBeSelected();
  expect(screen.getByTestId('not-selected-aria')).not.toBeSelected();
  expect(screen.getByTestId('default')).not.toBeSelected();
});

test('.toBeSelected() error messages', () => {
  render(
    <>
      <View testID="selected" accessibilityState={{ selected: true }} />
      <View testID="selected-aria" aria-selected />
      <View testID="not-selected" accessibilityState={{ selected: false }} />
      <View testID="not-selected-aria" aria-selected={false} />
      <View testID="default" />
    </>
  );

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

  expect(() => expect(screen.getByTestId('selected-aria')).not.toBeSelected())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeSelected()

    Received element is selected
      <View
        aria-selected={true}
        testID="selected-aria"
      />"
  `);

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

  expect(() => expect(screen.getByTestId('not-selected-aria')).toBeSelected())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeSelected()

    Received element is not selected
      <View
        aria-selected={false}
        testID="not-selected-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeSelected())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeSelected()

    Received element is not selected
      <View
        testID="default"
      />"
  `);
});
