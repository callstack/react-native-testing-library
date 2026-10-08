import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { render, screen } from '../../..';
import type { SyntheticEvent } from '../event';
import type { FireEventInit, FireEventType } from '../fire-event';
import { fireEvent } from '../fire-event';

/** Calls `fireEvent` with arguments its types don't allow, as JavaScript callers can. */
function fireEventUntyped(instance: TestInstance, eventType: string, ...args: unknown[]) {
  return fireEvent(instance, eventType as FireEventType, ...(args as [FireEventInit]));
}

describe('event object', () => {
  test('throws without an event object', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(fireEventUntyped(screen.getByTestId('input'), 'focus')).rejects.toThrow(
      `Unable to fire a "focus" event - please provide an event object, e.g. fireEvent(element, 'focus', { nativeEvent: {} }).`,
    );
    expect(onFocus).not.toHaveBeenCalled();
  });

  test('throws with more than one argument after the event type', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { nativeEvent: {} }, {}),
    ).rejects.toThrow(
      'Unable to fire a "focus" event - expected a single event object, received 2 arguments.',
    );
    expect(onFocus).not.toHaveBeenCalled();
  });

  test.each([
    ['text', 'string "text"'],
    [42, 'number 42'],
    [null, 'null'],
    [undefined, 'undefined'],
    [[{ nativeEvent: {} }], 'an array'],
    [new Date(0), 'an instance of Date'],
    [() => {}, 'a function'],
  ])('throws when the event is %p', async (event, description) => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(fireEventUntyped(screen.getByTestId('input'), 'focus', event)).rejects.toThrow(
      `Unable to fire a "focus" event - expected an event object, received ${description}.`,
    );
    expect(onFocus).not.toHaveBeenCalled();
  });

  test.each([
    [{ target: 1 }, '"target". "target" is set by the dispatch.'],
    [
      { target: {}, currentTarget: { measure: () => {} } },
      '"target", "currentTarget". "target", "currentTarget" are set by the dispatch.',
    ],
    [{ persist: () => {} }, '"persist". "persist" is provided by the event.'],
    [
      { preventDefault: () => {}, dispatchConfig: {} },
      '"preventDefault", "dispatchConfig". "preventDefault", "dispatchConfig" are provided by the event.',
    ],
    [{ text: 'Hello' }, '"text". Pass "text" in "nativeEvent" instead.'],
    [
      { text: 'Hello', target: 1, persist: () => {} },
      '"text", "target", "persist". "target" is set by the dispatch. "persist" is provided by the event. Pass "text" in "nativeEvent" instead.',
    ],
  ])('throws on unsupported keys %p', async (event, message) => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { nativeEvent: {}, ...event }),
    ).rejects.toThrow(`Unable to fire a "focus" event - unsupported event object keys: ${message}`);
    expect(onFocus).not.toHaveBeenCalled();
  });

  test('throws when nativeEvent is not an object', async () => {
    await render(<TextInput testID="input" />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { nativeEvent: 'text' }),
    ).rejects.toThrow(
      'Unable to fire a "focus" event - expected "nativeEvent" to be an object, received string "text".',
    );
  });

  test.each([
    ['123', 'string "123"'],
    [Number.NaN, 'number NaN'],
    [Infinity, 'number Infinity'],
    [null, 'null'],
  ])('throws when timeStamp is %p', async (timeStamp, description) => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { timeStamp }),
    ).rejects.toThrow(
      `Unable to fire a "focus" event - expected "timeStamp" to be a finite number, received ${description}.`,
    );
    expect(onFocus).not.toHaveBeenCalled();
  });

  test('passes timeStamp to handlers as event.timeStamp', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    const nativeEvent = { timestamp: 100 };
    await fireEvent(screen.getByTestId('input'), 'focus', { nativeEvent, timeStamp: 42 });

    const event: SyntheticEvent = onFocus.mock.calls[0][0];
    expect(event.timeStamp).toBe(42);
    expect(event.nativeEvent).toBe(nativeEvent);
    expect(nativeEvent).toEqual({ timestamp: 100 });
  });

  test('passes nativeEvent to handlers as event.nativeEvent', async () => {
    const onSubmitEditing = jest.fn();
    await render(<TextInput testID="input" onSubmitEditing={onSubmitEditing} />);

    const nativeEvent = { text: 'Hello', target: 1 };
    await fireEvent(screen.getByTestId('input'), 'submitEditing', { nativeEvent });

    expect(onSubmitEditing).toHaveBeenCalledTimes(1);
    const event: SyntheticEvent = onSubmitEditing.mock.calls[0][0];
    expect(event.type).toBe('submitediting');
    expect(event.nativeEvent).toBe(nativeEvent);
    expect(event.target).toBe(screen.getByTestId('input'));
  });

  test('uses an empty nativeEvent when the event object has none', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await fireEvent(screen.getByTestId('input'), 'focus', {});

    expect(onFocus.mock.calls[0][0].nativeEvent).toEqual({});
  });

  test('accepts an event object without a prototype', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await fireEvent(screen.getByTestId('input'), 'focus', Object.create(null));

    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});

test('throws without an element', async () => {
  await expect(
    fireEventUntyped(null as unknown as TestInstance, 'focus', { nativeEvent: {} }),
  ).rejects.toThrow('Unable to fire a "focus" event - please provide a host element.');
});

test('accepts event type with or without the "on" prefix', async () => {
  const onFocus = jest.fn();
  await render(<TextInput testID="input" onFocus={onFocus} />);

  await fireEvent(screen.getByTestId('input'), 'focus', {});
  await fireEvent(screen.getByTestId('input'), 'onFocus', {});

  expect(onFocus).toHaveBeenCalledTimes(2);
  expect(onFocus.mock.calls[1][0].type).toBe('focus');
});

test('dispatches bubbling events through capture and bubble phases', async () => {
  const calls: string[] = [];
  await render(
    <View
      onFocusCapture={() => calls.push('parent.onFocusCapture')}
      onFocus={() => calls.push('parent.onFocus')}
    >
      <TextInput testID="input" onFocus={() => calls.push('input.onFocus')} />
    </View>,
  );

  await fireEvent(screen.getByTestId('input'), 'focus', {});

  expect(calls).toEqual(['parent.onFocusCapture', 'input.onFocus', 'parent.onFocus']);
});

test('dispatches direct events to the target only', async () => {
  const onParentLayout = jest.fn();
  const onLayout = jest.fn();
  await render(
    <View onLayout={onParentLayout}>
      <View testID="target" onLayout={onLayout} />
    </View>,
  );

  const nativeEvent = { layout: { x: 0, y: 0, width: 100, height: 50 } };
  await fireEvent(screen.getByTestId('target'), 'layout', { nativeEvent });

  expect(onLayout).toHaveBeenCalledTimes(1);
  expect(onLayout.mock.calls[0][0].nativeEvent).toBe(nativeEvent);
  expect(onParentLayout).not.toHaveBeenCalled();
});

test('does not call props of composite components', async () => {
  const onCompositeFocus = jest.fn();
  function Wrapper({ children }: { children: React.ReactNode; onFocus: () => void }) {
    return <View>{children}</View>;
  }

  await render(
    <Wrapper onFocus={onCompositeFocus}>
      <TextInput testID="input" />
    </Wrapper>,
  );

  await fireEvent(screen.getByTestId('input'), 'focus', {});

  expect(onCompositeFocus).not.toHaveBeenCalled();
});

describe('event types unknown to React Native', () => {
  test.each([
    ['changeText', 'changeText', 'use fireEvent.changeText() or userEvent.type() instead.'],
    ['onChangeText', 'changeText', 'use fireEvent.changeText() or userEvent.type() instead.'],
    ['pressIn', 'pressIn', 'use userEvent.press() instead.'],
    ['pressOut', 'pressOut', 'use userEvent.press() instead.'],
    ['longPress', 'longPress', 'use userEvent.longPress() instead.'],
    ['customEvent', 'customEvent', 'so no handler would be called.'],
  ])('"%s" throws', async (eventType, normalizedType, hint) => {
    const handler = jest.fn();
    const handlerProps = {
      onChangeText: handler,
      onPressIn: handler,
      onPressOut: handler,
      onLongPress: handler,
      onCustomEvent: handler,
    };
    await render(<TextInput testID="input" {...handlerProps} />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), eventType, { nativeEvent: {} }),
    ).rejects.toThrow(
      `Unable to fire a "${normalizedType}" event - React Native doesn't dispatch ` +
        `"${normalizedType}" natively, ${hint}`,
    );
    expect(handler).not.toHaveBeenCalled();
  });

  test('are type errors', async () => {
    await render(<TextInput testID="input" />);
    const input = screen.getByTestId('input');

    // @ts-expect-error `changeText` isn't dispatched natively.
    await expect(fireEvent(input, 'changeText', {})).rejects.toThrow();
    // @ts-expect-error `onChangeText` isn't dispatched natively.
    await expect(fireEvent(input, 'onChangeText', {})).rejects.toThrow();
  });

  test('throws before checking the event object', async () => {
    await render(<TextInput testID="input" />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'changeText', 'Hello'),
    ).rejects.toThrow(`React Native doesn't dispatch "changeText" natively`);
  });
});

test('returns false when a handler calls preventDefault()', async () => {
  await render(
    <Text testID="text" onPress={(event) => event.preventDefault()}>
      Press me
    </Text>,
  );

  expect(await fireEvent(screen.getByTestId('text'), 'press', {})).toBe(false);
});

test('returns true when no handler calls preventDefault()', async () => {
  const onPress = jest.fn();
  await render(
    <Text testID="text" onPress={onPress}>
      Press me
    </Text>,
  );

  expect(await fireEvent(screen.getByTestId('text'), 'press', {})).toBe(true);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('is a no-op on an unmounted element', async () => {
  const onFocus = jest.fn();
  await render(<TextInput testID="input" onFocus={onFocus} />);
  const input = screen.getByTestId('input');
  await screen.rerender(<View />);

  expect(await fireEvent(input, 'focus', {})).toBe(true);
  expect(onFocus).not.toHaveBeenCalled();
});

test('rejects with the handler error', async () => {
  await render(
    <TextInput
      testID="input"
      onFocus={() => {
        throw new Error('Handler error');
      }}
    />,
  );

  await expect(fireEvent(screen.getByTestId('input'), 'focus', {})).rejects.toThrow(
    'Handler error',
  );
});

test('renders state updates from the handler', async () => {
  function Counter() {
    const [count, setCount] = React.useState(0);
    return (
      <Text testID="text" onPress={() => setCount((value) => value + 1)}>
        Count: {count}
      </Text>
    );
  }

  await render(<Counter />);
  await fireEvent(screen.getByTestId('text'), 'press', {});

  expect(screen.getByText('Count: 1')).toBeOnTheScreen();
});
