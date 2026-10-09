import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen } from '../..';
import { getConfig } from '../../config';
import { createEvent } from '../create-event';
import { dispatchEvent } from '../dispatch-event';
import { SyntheticEvent } from '../modern/event';
import { buildFocusNativeEvent } from '../shared/payloads';

test('dispatches the event of the selected event system', async () => {
  const calls: string[] = [];
  const onTargetPointerDown = jest.fn(() => calls.push('target.onPointerDown'));
  await render(
    <View
      onPointerDownCapture={() => calls.push('parent.onPointerDownCapture')}
      onPointerDown={() => calls.push('parent.onPointerDown')}
    >
      <View testID="target" onPointerDown={onTargetPointerDown} />
    </View>,
  );

  const event = createEvent('pointerDown', { pointerId: 1 });
  expect(await dispatchEvent(screen.getByTestId('target'), 'pointerDown', event)).toBe(true);
  expect(onTargetPointerDown).toHaveBeenCalledWith(event);
  const isModern = getConfig().unstable_eventSystem === 'modern';
  expect(event instanceof SyntheticEvent).toBe(isModern);
  // Modern goes through capture and bubble phases. Legacy calls only the target prop.
  expect(calls).toEqual(
    isModern
      ? ['parent.onPointerDownCapture', 'target.onPointerDown', 'parent.onPointerDown']
      : ['target.onPointerDown'],
  );
});

test('returns whether an ancestor handled the event', async () => {
  const onParentPointerDown = jest.fn();
  await render(
    <View onPointerDown={onParentPointerDown}>
      <View testID="target" />
    </View>,
  );

  const event = createEvent('pointerDown', { pointerId: 1 });
  const result = await dispatchEvent(screen.getByTestId('target'), 'pointerDown', event);
  const isModern = getConfig().unstable_eventSystem === 'modern';
  expect(result).toBe(isModern);
  expect(onParentPointerDown).toHaveBeenCalledTimes(isModern ? 1 : 0);
});

test('returns false without a handler on the path', async () => {
  await render(
    <View>
      <TextInput testID="input" />
    </View>,
  );

  const event = createEvent('focus', buildFocusNativeEvent());
  expect(await dispatchEvent(screen.getByTestId('input'), 'focus', event)).toBe(false);
});

test('calls testOnly_ props', async () => {
  const onFocus = jest.fn();
  await render(<View testID="view" {...{ testOnly_onFocus: onFocus }} />);

  const event = createEvent('focus', buildFocusNativeEvent());
  expect(await dispatchEvent(screen.getByTestId('view'), 'focus', event)).toBe(true);
  expect(onFocus).toHaveBeenCalledWith(event);
});
