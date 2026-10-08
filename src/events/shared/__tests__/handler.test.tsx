import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../../..';
import { getEventHandlerFromProps, getHandlerByName, normalizeEventType } from '../handler';

test('getEventHandlerFromProps strict mode', async () => {
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

  expect(getEventHandlerFromProps(regular.props, 'press')).toBe(onPress);
  expect(getEventHandlerFromProps(testOnly.props, 'press')).toBe(testOnlyOnPress);
  expect(getEventHandlerFromProps(both.props, 'press')).toBe(onPress);

  expect(getEventHandlerFromProps(regular.props, 'onPress')).toBe(onPress);
  expect(getEventHandlerFromProps(testOnly.props, 'onPress')).toBe(testOnlyOnPress);
  expect(getEventHandlerFromProps(both.props, 'onPress')).toBe(onPress);
});

test('getEventHandlerFromProps does not treat event names starting with "on" as prefixed', async () => {
  const onOnline = jest.fn();
  // @ts-expect-error Intentionally passing such props
  await render(<View testID="view" onOnline={onOnline} />);

  expect(getEventHandlerFromProps(screen.getByTestId('view').props, 'online')).toBe(onOnline);
});

test('getEventHandlerFromProps loose mode', async () => {
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

  expect(getEventHandlerFromProps(regular.props, 'press', { loose: true })).toBe(onPress);
  expect(getEventHandlerFromProps(testOnly.props, 'press', { loose: true })).toBe(testOnlyOnPress);
  expect(getEventHandlerFromProps(both.props, 'press', { loose: true })).toBe(onPress);

  expect(getEventHandlerFromProps(regular.props, 'onPress', { loose: true })).toBe(onPress);
  expect(getEventHandlerFromProps(testOnly.props, 'onPress', { loose: true })).toBe(
    testOnlyOnPress,
  );
  expect(getEventHandlerFromProps(both.props, 'onPress', { loose: true })).toBe(onPress);
});

test('getEventHandlerFromProps loose mode matches handlers named without the `on*` prefix', async () => {
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

  expect(getEventHandlerFromProps(regular.props, 'press', { loose: true })).toBe(press);
  expect(getEventHandlerFromProps(testOnly.props, 'press', { loose: true })).toBe(testOnlyPress);

  expect(getEventHandlerFromProps(regular.props, 'press')).toBeUndefined();
  expect(getEventHandlerFromProps(testOnly.props, 'press')).toBeUndefined();
});

test('normalizeEventType strips the `on*` prefix', () => {
  expect(normalizeEventType('onLayout')).toBe('layout');
  expect(normalizeEventType('onChangeText')).toBe('changeText');
  expect(normalizeEventType('layout')).toBe('layout');
  expect(normalizeEventType('changeText')).toBe('changeText');
  expect(normalizeEventType('once')).toBe('once');
  expect(normalizeEventType('on')).toBe('on');
});

test('getHandlerByName returns function props with the exact name or its testOnly_ variant', () => {
  const onFocus = jest.fn();
  const testOnlyOnBlur = jest.fn();
  const props = {
    onFocus,
    testOnly_onFocus: jest.fn(),
    testOnly_onBlur: testOnlyOnBlur,
    onLayout: 'not a function',
  };

  expect(getHandlerByName(props, 'onFocus')).toBe(onFocus);
  expect(getHandlerByName(props, 'onBlur')).toBe(testOnlyOnBlur);
  expect(getHandlerByName(props, 'focus')).toBeUndefined();
  expect(getHandlerByName(props, 'onLayout')).toBeUndefined();
});
