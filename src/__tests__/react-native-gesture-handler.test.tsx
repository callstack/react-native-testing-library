import 'react-native-gesture-handler/jestSetup.js';
import React from 'react';
import { View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

import { fireEvent, render, screen, userEvent } from '..';
import { createEventLogger, getEventsNames } from '../test-utils/events';

test('fireEvent can invoke press events for RNGH Pressable', async () => {
  const onPress = jest.fn();
  const onPressIn = jest.fn();
  const onPressOut = jest.fn();
  const onLongPress = jest.fn();

  await render(
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

  await fireEvent.press(pressable);
  expect(onPress).toHaveBeenCalled();

  await fireEvent(pressable, 'pressIn');
  expect(onPressIn).toHaveBeenCalled();

  await fireEvent(pressable, 'pressOut');
  expect(onPressOut).toHaveBeenCalled();

  await fireEvent(pressable, 'longPress');
  expect(onLongPress).toHaveBeenCalled();
});

test('userEvent can invoke press events for RNGH Pressable', async () => {
  const { events, logEvent } = createEventLogger();
  const user = userEvent.setup();

  await render(
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

  const eventSequence = getEventsNames(events).join(', ');
  expect(
    eventSequence === 'pressIn, pressOut, press' || eventSequence === 'pressIn, press, pressOut',
  ).toBe(true);
});
