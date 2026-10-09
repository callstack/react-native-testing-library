import * as React from 'react';
import { TextInput, View } from 'react-native';

import { configure, render, screen } from '../..';
import { createEvent } from '../create-event';
import { dispatchEvent } from '../dispatch-event';
import { SyntheticEvent } from '../modern/event';
import { buildFocusNativeEvent } from '../shared/payloads';

describe('legacy event system', () => {
  beforeEach(() => {
    configure({ eventSystem: 'legacy' });
  });

  test('calls only the target prop with the legacy event object', async () => {
    const onPointerDown = jest.fn();
    const onParentPointerDown = jest.fn();
    await render(
      <View onPointerDown={onParentPointerDown}>
        <View testID="target" onPointerDown={onPointerDown} />
      </View>,
    );

    const event = createEvent('pointerDown', { pointerId: 1 });
    expect(await dispatchEvent(screen.getByTestId('target'), 'pointerDown', event)).toBe(true);
    expect(onPointerDown).toHaveBeenCalledWith(event);
    expect(onParentPointerDown).not.toHaveBeenCalled();
  });

  test('returns false without a handler', async () => {
    await render(<TextInput testID="input" />);

    const event = createEvent('focus', buildFocusNativeEvent());
    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', event)).toBe(false);
  });
});

describe('modern event system', () => {
  beforeEach(() => {
    configure({ eventSystem: 'modern' });
  });

  test('dispatches SyntheticEvent through capture and bubble phases', async () => {
    const calls: string[] = [];
    await render(
      <View
        testID="parent"
        onPointerDownCapture={() => calls.push('parent.onPointerDownCapture')}
        onPointerDown={(event) => {
          calls.push('parent.onPointerDown');
          expect(event).toBeInstanceOf(SyntheticEvent);
          expect(event.nativeEvent).toEqual({ pointerId: 1 });
          expect(event.target).toBe(screen.getByTestId('target'));
        }}
      >
        <View testID="target" onPointerDown={() => calls.push('target.onPointerDown')} />
      </View>,
    );

    const event = createEvent('pointerDown', { pointerId: 1 });
    expect(await dispatchEvent(screen.getByTestId('target'), 'pointerDown', event)).toBe(true);
    expect(calls).toEqual([
      'parent.onPointerDownCapture',
      'target.onPointerDown',
      'parent.onPointerDown',
    ]);
  });

  test('returns true when only an ancestor handles the event', async () => {
    const onParentPointerDown = jest.fn();
    await render(
      <View onPointerDown={onParentPointerDown}>
        <View testID="target" />
      </View>,
    );

    const event = createEvent('pointerDown', { pointerId: 1 });
    expect(await dispatchEvent(screen.getByTestId('target'), 'pointerDown', event)).toBe(true);
    expect(onParentPointerDown).toHaveBeenCalledTimes(1);
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
});
