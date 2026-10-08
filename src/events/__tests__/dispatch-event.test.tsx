import * as React from 'react';
import { TextInput, View } from 'react-native';

import { configure, render, screen } from '../..';
import { dispatchEvent } from '../dispatch-event';
import { buildFocusEvent, buildTouchEvent } from '../legacy';
import { SyntheticEvent } from '../modern/event';

describe('legacy event system', () => {
  test('calls only the target prop with the event as it is', async () => {
    const onFocus = jest.fn();
    const onParentFocus = jest.fn();
    await render(
      <View onFocus={onParentFocus}>
        <TextInput testID="input" onFocus={onFocus} />
      </View>,
    );

    const event = buildFocusEvent();
    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', event)).toBe(true);
    expect(onFocus).toHaveBeenCalledWith(event);
    expect(onParentFocus).not.toHaveBeenCalled();
  });

  test('returns false without a handler', async () => {
    await render(<TextInput testID="input" />);
    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', buildFocusEvent())).toBe(
      false,
    );
  });
});

describe('modern event system', () => {
  beforeEach(() => {
    configure({ eventSystem: 'modern' });
  });

  test('dispatches native events as SyntheticEvent with capture and bubble phases', async () => {
    const calls: string[] = [];
    await render(
      <View
        testID="parent"
        onFocusCapture={() => calls.push('parent.onFocusCapture')}
        onFocus={(event) => {
          calls.push('parent.onFocus');
          expect(event).toBeInstanceOf(SyntheticEvent);
          expect(event.nativeEvent).toEqual({ target: 0 });
          expect(event.target).toBe(screen.getByTestId('input'));
        }}
      >
        <TextInput testID="input" onFocus={() => calls.push('input.onFocus')} />
      </View>,
    );

    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', buildFocusEvent())).toBe(true);
    expect(calls).toEqual(['parent.onFocusCapture', 'input.onFocus', 'parent.onFocus']);
  });

  test('returns true when only an ancestor handles the event', async () => {
    const onParentFocus = jest.fn();
    await render(
      <View onFocus={onParentFocus}>
        <TextInput testID="input" />
      </View>,
    );

    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', buildFocusEvent())).toBe(true);
    expect(onParentFocus).toHaveBeenCalledTimes(1);
  });

  test('returns false without a handler on the path', async () => {
    await render(
      <View>
        <TextInput testID="input" />
      </View>,
    );

    expect(await dispatchEvent(screen.getByTestId('input'), 'focus', buildFocusEvent())).toBe(
      false,
    );
  });

  test('calls JavaScript callbacks on the target only, with their arguments', async () => {
    const onChangeText = jest.fn();
    const onParentChangeText = jest.fn();
    await render(
      // @ts-expect-error `onChangeText` is not a `View` prop, but it shouldn't be called anyway.
      <View onChangeText={onParentChangeText}>
        <TextInput testID="input" onChangeText={onChangeText} />
      </View>,
    );

    expect(await dispatchEvent(screen.getByTestId('input'), 'changeText', 'Hello')).toBe(true);
    expect(onChangeText).toHaveBeenCalledWith('Hello');
    expect(onParentChangeText).not.toHaveBeenCalled();
  });

  test('calls testOnly_ props for native events and JavaScript callbacks', async () => {
    const onFocus = jest.fn();
    const onPressIn = jest.fn();
    const testOnlyProps = { testOnly_onFocus: onFocus, testOnly_onPressIn: onPressIn };
    await render(<View testID="view" {...testOnlyProps} />);

    expect(await dispatchEvent(screen.getByTestId('view'), 'focus', buildFocusEvent())).toBe(true);
    const touchEvent = buildTouchEvent();
    expect(await dispatchEvent(screen.getByTestId('view'), 'pressIn', touchEvent)).toBe(true);
    expect(onFocus).toHaveBeenCalledWith(expect.any(SyntheticEvent));
    expect(onPressIn).toHaveBeenCalledWith(touchEvent);
  });
});
