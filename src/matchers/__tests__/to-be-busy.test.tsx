import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toBeBusy() basic case', () => {
  render(
    <>
      <View testID="busy" accessibilityState={{ busy: true }} />
      <View testID="busy-aria" aria-busy />
      <View testID="not-busy" accessibilityState={{ busy: false }} />
      <View testID="not-busy-aria" aria-busy={false} />
      <View testID="default" />
    </>
  );

  expect(screen.getByTestId('busy')).toBeBusy();
  expect(screen.getByTestId('busy-aria')).toBeBusy();
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
  expect(screen.getByTestId('not-busy-aria')).not.toBeBusy();
  expect(screen.getByTestId('default')).not.toBeBusy();
});

test('toBeBusy() error messages', () => {
  render(
    <>
      <View testID="busy" accessibilityState={{ busy: true }} />
      <View testID="busy-aria" aria-busy />
      <View testID="not-busy" accessibilityState={{ busy: false }} />
      <View testID="not-busy-aria" aria-busy={false} />
      <View testID="default" />
    </>
  );

  expect(() => expect(screen.getByTestId('busy')).not.toBeBusy())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeBusy()

    Received element is busy:
      <View
        accessibilityState={
          {
            "busy": true,
          }
        }
        testID="busy"
      />"
  `);

  expect(() => expect(screen.getByTestId('busy-aria')).not.toBeBusy())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeBusy()

    Received element is busy:
      <View
        aria-busy={true}
        testID="busy-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-busy')).toBeBusy())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeBusy()

    Received element is not busy:
      <View
        accessibilityState={
          {
            "busy": false,
          }
        }
        testID="not-busy"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-busy-aria')).toBeBusy())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeBusy()

    Received element is not busy:
      <View
        aria-busy={false}
        testID="not-busy-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeBusy())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeBusy()

    Received element is not busy:
      <View
        testID="default"
      />"
  `);
});
