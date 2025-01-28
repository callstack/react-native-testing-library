import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '../..';
import { getEventHandler } from '../event-handler';

test('getEventHandler strict mode', () => {
  const onPress = jest.fn();
  const testOnlyOnPress = jest.fn();

  render(
    <View>
      <Text testID="regular" onPress={onPress} />
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="testOnly" testOnly_onPress={testOnlyOnPress} />
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="both" onPress={onPress} testOnly_onPress={testOnlyOnPress} />
    </View>,
  );

  const regular = screen.getByTestId('regular');
  const testOnly = screen.getByTestId('testOnly');
  const both = screen.getByTestId('both');

  expect(getEventHandler(regular, 'press')).toBe(onPress);
  expect(getEventHandler(testOnly, 'press')).toBe(testOnlyOnPress);
  expect(getEventHandler(both, 'press')).toBe(onPress);

  expect(getEventHandler(regular, 'onPress')).toBe(undefined);
  expect(getEventHandler(testOnly, 'onPress')).toBe(undefined);
  expect(getEventHandler(both, 'onPress')).toBe(undefined);
});

test('getEventHandler loose mode', () => {
  const onPress = jest.fn();
  const testOnlyOnPress = jest.fn();

  render(
    <View>
      <Text testID="regular" onPress={onPress} />
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="testOnly" testOnly_onPress={testOnlyOnPress} />
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="both" onPress={onPress} testOnly_onPress={testOnlyOnPress} />
    </View>,
  );

  const regular = screen.getByTestId('regular');
  const testOnly = screen.getByTestId('testOnly');
  const both = screen.getByTestId('both');

  expect(getEventHandler(regular, 'press', { loose: true })).toBe(onPress);
  expect(getEventHandler(testOnly, 'press', { loose: true })).toBe(testOnlyOnPress);
  expect(getEventHandler(both, 'press', { loose: true })).toBe(onPress);

  expect(getEventHandler(regular, 'onPress', { loose: true })).toBe(onPress);
  expect(getEventHandler(testOnly, 'onPress', { loose: true })).toBe(testOnlyOnPress);
  expect(getEventHandler(both, 'onPress', { loose: true })).toBe(onPress);
});
