import React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toBeBusy() basic case with accessibilityState', () => {
  render(
    <View>
      <View testID="busy" accessible accessibilityState={{ busy: true }} />
      <View testID="not-busy" accessible accessibilityState={{ busy: false }} />
    </View>
  );

  expect(screen.getByTestId('busy')).toBeBusy();
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
});

test('toBeBusy() basic case with aria-busy', () => {
  render(
    <View>
      <View testID="busy" aria-busy />
      <View testID="not-busy" aria-busy={false} />
    </View>
  );

  expect(screen.getByTestId('busy')).toBeBusy();
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
});

test('toBeBusy() error cases with accessibilityState', () => {
  render(
    <View>
      <View testID="busy" accessible accessibilityState={{ busy: true }} />
      <View testID="not-busy" accessible accessibilityState={{ busy: false }} />
    </View>
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
        accessible={true}
        testID="busy"
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
        accessible={true}
        testID="not-busy"
      />"
  `);
});
