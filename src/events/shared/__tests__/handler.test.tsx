import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../../..';
import { getEventHandlerByEventType, getEventHandlerByName, normalizeEventType } from '../handler';

test('getEventHandlerByEventType strict mode', async () => {
  const onPress = jest.fn();
  const testOnlyOnPress = jest.fn();

  await render(
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

  expect(getEventHandlerByEventType(regular.props, 'press')).toBe(onPress);
  expect(getEventHandlerByEventType(testOnly.props, 'press')).toBe(testOnlyOnPress);
  expect(getEventHandlerByEventType(both.props, 'press')).toBe(onPress);

  expect(getEventHandlerByEventType(regular.props, 'onPress')).toBe(onPress);
  expect(getEventHandlerByEventType(testOnly.props, 'onPress')).toBe(testOnlyOnPress);
  expect(getEventHandlerByEventType(both.props, 'onPress')).toBe(onPress);
});

test('getEventHandlerByEventType does not treat event names starting with "on" as prefixed', async () => {
  const onOnline = jest.fn();
  // @ts-expect-error Intentionally passing such props
  await render(<View testID="view" onOnline={onOnline} />);

  expect(getEventHandlerByEventType(screen.getByTestId('view').props, 'online')).toBe(onOnline);
});

test('getEventHandlerByEventType loose mode', async () => {
  const onPress = jest.fn();
  const testOnlyOnPress = jest.fn();

  await render(
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

  expect(getEventHandlerByEventType(regular.props, 'press', { loose: true })).toBe(onPress);
  expect(getEventHandlerByEventType(testOnly.props, 'press', { loose: true })).toBe(
    testOnlyOnPress,
  );
  expect(getEventHandlerByEventType(both.props, 'press', { loose: true })).toBe(onPress);

  expect(getEventHandlerByEventType(regular.props, 'onPress', { loose: true })).toBe(onPress);
  expect(getEventHandlerByEventType(testOnly.props, 'onPress', { loose: true })).toBe(
    testOnlyOnPress,
  );
  expect(getEventHandlerByEventType(both.props, 'onPress', { loose: true })).toBe(onPress);
});

test('getEventHandlerByEventType loose mode matches handlers named without the `on*` prefix', async () => {
  const press = jest.fn();
  const testOnlyPress = jest.fn();

  await render(
    <View>
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="regular" press={press} />
      {/* @ts-expect-error Intentionally passing such props */}
      <View testID="testOnly" testOnly_press={testOnlyPress} />
    </View>,
  );

  const regular = screen.getByTestId('regular');
  const testOnly = screen.getByTestId('testOnly');

  expect(getEventHandlerByEventType(regular.props, 'press', { loose: true })).toBe(press);
  expect(getEventHandlerByEventType(testOnly.props, 'press', { loose: true })).toBe(testOnlyPress);

  expect(getEventHandlerByEventType(regular.props, 'press')).toBeUndefined();
  expect(getEventHandlerByEventType(testOnly.props, 'press')).toBeUndefined();
});

test('normalizeEventType strips the `on*` prefix', () => {
  expect(normalizeEventType('onLayout')).toBe('layout');
  expect(normalizeEventType('onChangeText')).toBe('changeText');
  expect(normalizeEventType('layout')).toBe('layout');
  expect(normalizeEventType('changeText')).toBe('changeText');
  expect(normalizeEventType('once')).toBe('once');
  expect(normalizeEventType('on')).toBe('on');
});

test('getEventHandlerByName returns function props with the exact name or its testOnly_ variant', () => {
  const onFocus = jest.fn();
  const testOnlyOnBlur = jest.fn();
  const props = {
    onFocus,
    testOnly_onFocus: jest.fn(),
    testOnly_onBlur: testOnlyOnBlur,
    onLayout: 'not a function',
  };

  expect(getEventHandlerByName(props, 'onFocus')).toBe(onFocus);
  expect(getEventHandlerByName(props, 'onBlur')).toBe(testOnlyOnBlur);
  expect(getEventHandlerByName(props, 'focus')).toBeUndefined();
  expect(getEventHandlerByName(props, 'onLayout')).toBeUndefined();
});
