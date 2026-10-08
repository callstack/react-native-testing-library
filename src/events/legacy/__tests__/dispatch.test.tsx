import * as React from 'react';
import { Text } from 'react-native';

import { render, screen } from '../../..';
import { buildTouchEvent } from '../builders/common';
import { dispatchEvent } from '../dispatch';

const TOUCH_EVENT = buildTouchEvent();

test('dispatchEvent calls the target handler', async () => {
  const onPress = jest.fn();
  await render(<Text testID="text" onPress={onPress} />);

  await dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('dispatchEvent does not call the parent host component handler', async () => {
  const onPressParent = jest.fn();
  await render(
    <Text onPress={onPressParent}>
      <Text testID="text" />
    </Text>,
  );

  await dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
  expect(onPressParent).not.toHaveBeenCalled();
});

test('dispatchEvent does not throw when no handler is found', async () => {
  await render(
    <Text>
      <Text testID="text" />
    </Text>,
  );

  await expect(
    dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT),
  ).resolves.not.toThrow();
});
