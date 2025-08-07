import 'react-native-gesture-handler/jestSetup.js';
import React from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

import { fireEvent, render, screen, userEvent } from '..';
import { createEventLogger, getEventsNames } from '../test-utils/events';

test('fireEvent can invoke press events for RNGH Pressable', () => {
  const onPress = jest.fn();
  const onPressIn = jest.fn();
  const onPressOut = jest.fn();
  const onLongPress = jest.fn();

  render(
    <View>
      <Pressable
        testID="pressable"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
      />
    </View>,
  );

  const pressable = screen.getByTestId('pressable');

  fireEvent.press(pressable);
  expect(onPress).toHaveBeenCalled();

  fireEvent(pressable, 'pressIn');
  expect(onPressIn).toHaveBeenCalled();

  fireEvent(pressable, 'pressOut');
  expect(onPressOut).toHaveBeenCalled();

  fireEvent(pressable, 'longPress');
  expect(onLongPress).toHaveBeenCalled();
});

test('userEvent can invoke press events for RNGH Pressable', async () => {
  const { events, logEvent } = createEventLogger();
  const user = userEvent.setup();

  render(
    <View>
      <Pressable
        testID="pressable"
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
        onLongPress={logEvent('longPress')}
      />
    </View>,
  );

  const pressable = screen.getByTestId('pressable');
  await user.press(pressable);
  expect(getEventsNames(events)).toEqual(['pressIn', 'pressOut', 'press']);
});
