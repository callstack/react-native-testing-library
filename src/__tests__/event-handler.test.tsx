import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '..';
import { getEventHandlerFromProps } from '../event-handler';

test('getEventHandler strict mode', async () => {
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

test('getEventHandler does not treat event names starting with "on" as prefixed', async () => {
  const onOnline = jest.fn();
  // @ts-expect-error Intentionally passing such props
  await render(<View testID="view" onOnline={onOnline} />);

  expect(getEventHandlerFromProps(screen.getByTestId('view').props, 'online')).toBe(onOnline);
});

test('getEventHandler loose mode', async () => {
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
