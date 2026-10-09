import * as React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { render, screen } from '../../..';
import { nativeState } from '../../shared/native-state';
import type { SyntheticEvent } from '../event';
import type { FireEventInit } from '../fire-event';
import { fireEvent } from '../fire-event';

const defaultScrollPayload = {
  contentInset: { bottom: 0, left: 0, right: 0, top: 0 },
  contentOffset: { x: 0, y: 0 },
  contentSize: { height: 0, width: 0 },
  layoutMeasurement: { height: 0, width: 0 },
  responderIgnoreScroll: true,
  target: 0,
  velocity: { x: 0, y: 0 },
};

/** Calls `fireEvent` with arguments its types don't allow, as JavaScript callers can. */
function fireEventUntyped(instance: TestInstance, eventType: string, ...args: unknown[]) {
  return fireEvent(instance, eventType, ...(args as [FireEventInit]));
}

describe('event object', () => {
  test('throws without an event object', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(fireEventUntyped(screen.getByTestId('input'), 'focus')).rejects.toThrow(
      `Unable to fire a "focus" event. Please provide an event object, e.g. fireEvent(element, 'focus', { nativeEvent: {} }).`,
    );
    expect(onFocus).not.toHaveBeenCalled();
  });

  test('throws with more than one argument after the event type', async () => {
    const onFocus = jest.fn();
    await render(<TextInput testID="input" onFocus={onFocus} />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { nativeEvent: {} }, {}),
    ).rejects.toThrow(
      'Unable to fire a "focus" event. Expected a single event object, received 2 arguments.',
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
      `Unable to fire a "focus" event. Expected an event object, received ${description}.`,
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
    ).rejects.toThrow(`Unable to fire a "focus" event. Unsupported event object keys: ${message}`);
    expect(onFocus).not.toHaveBeenCalled();
  });

  test('throws when nativeEvent is not an object', async () => {
    await render(<TextInput testID="input" />);

    await expect(
      fireEventUntyped(screen.getByTestId('input'), 'focus', { nativeEvent: 'text' }),
    ).rejects.toThrow(
      'Unable to fire a "focus" event. Expected "nativeEvent" to be an object, received string "text".',
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
      `Unable to fire a "focus" event. Expected "timeStamp" to be a finite number, received ${description}.`,
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
  ).rejects.toThrow('Unable to fire a "focus" event. Please provide a host element.');
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
      onPointerDownCapture={() => calls.push('parent.onPointerDownCapture')}
      onPointerDown={() => calls.push('parent.onPointerDown')}
    >
      <View testID="target" onPointerDown={() => calls.push('target.onPointerDown')} />
    </View>,
  );

  await fireEvent(screen.getByTestId('target'), 'pointerDown', {});

  expect(calls).toEqual([
    'parent.onPointerDownCapture',
    'target.onPointerDown',
    'parent.onPointerDown',
  ]);
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
    ['changeText', 'changeText', '. Use fireEvent.changeText() or userEvent.type() instead.'],
    ['onChangeText', 'changeText', '. Use fireEvent.changeText() or userEvent.type() instead.'],
    ['pressIn', 'pressIn', '. Use userEvent.press() instead.'],
    ['pressOut', 'pressOut', '. Use userEvent.press() instead.'],
    ['longPress', 'longPress', '. Use userEvent.longPress() instead.'],
    ['customEvent', 'customEvent', ', so no handler would be called.'],
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
      `Unable to fire a "${normalizedType}" event. React Native doesn't dispatch ` +
        `"${normalizedType}" natively${hint}`,
    );
    expect(handler).not.toHaveBeenCalled();
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

describe('native state', () => {
  test.each([
    'scroll',
    'onScroll',
    'scrollBeginDrag',
    'scrollEndDrag',
    'momentumScrollBegin',
    'momentumScrollEnd',
  ])('saves content offset of ScrollView from %s event', async (eventType) => {
    await render(<ScrollView testID="scroll" />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent(scrollView, eventType, { nativeEvent: { contentOffset: { y: 200 } } });

    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({ x: 0, y: 200 });
  });

  test('does not save content offset from scroll event without one', async () => {
    await render(<ScrollView testID="scroll" />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent(scrollView, 'scroll', { nativeEvent: {} });

    expect(nativeState.contentOffsetForInstance.get(scrollView)).toBeUndefined();
  });

  test('saves layout size from layout event, with non-finite values as 0', async () => {
    await render(<View testID="view" />);
    const view = screen.getByTestId('view');

    await fireEvent(view, 'layout', { nativeEvent: { layout: { width: 50, height: NaN } } });

    expect(nativeState.layoutSizeForInstance.get(view)).toEqual({ width: 50, height: 0 });
  });

  test.each(['change', 'onChange'])('saves value of TextInput from %s event', async (eventType) => {
    await render(<TextInput testID="input" />);
    const input = screen.getByTestId('input');

    await fireEvent(input, eventType, { nativeEvent: { text: 'Hello' } });

    expect(nativeState.valueForInstance.get(input)).toBe('Hello');
  });

  test('does not save value from change event without text or on non-editable TextInput', async () => {
    await render(
      <>
        <TextInput testID="input" />
        <TextInput testID="non-editable" editable={false} />
      </>,
    );
    const input = screen.getByTestId('input');
    const nonEditable = screen.getByTestId('non-editable');

    await fireEvent(input, 'change', { nativeEvent: {} });
    await fireEvent(nonEditable, 'change', { nativeEvent: { text: 'Hello' } });

    expect(nativeState.valueForInstance.get(input)).toBeUndefined();
    expect(nativeState.valueForInstance.get(nonEditable)).toBeUndefined();
  });

  test('is saved before handlers run', async () => {
    let contentOffset;
    const onScroll = jest.fn(() => {
      contentOffset = nativeState.contentOffsetForInstance.get(screen.getByTestId('scroll'));
    });
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);

    await fireEvent(screen.getByTestId('scroll'), 'scroll', {
      nativeEvent: { contentOffset: { y: 200 } },
    });

    expect(contentOffset).toEqual({ x: 0, y: 200 });
  });

  test('is not saved for unmounted element', async () => {
    await render(<ScrollView testID="scroll" />);
    const scrollView = screen.getByTestId('scroll');
    await screen.rerender(<View />);

    await fireEvent(scrollView, 'scroll', { nativeEvent: { contentOffset: { y: 200 } } });

    expect(nativeState.contentOffsetForInstance.get(scrollView)).toBeUndefined();
  });
});

describe('fireEvent.changeText', () => {
  function logChangeHandlers(calls: string[], id: string) {
    return {
      onChange: () => calls.push(`${id}.onChange`),
      onChangeCapture: () => calls.push(`${id}.onChangeCapture`),
    };
  }

  test('fires change event with the text, then calls onChangeText', async () => {
    const calls: string[] = [];
    const onChange = jest.fn((_event: unknown) => calls.push('onChange'));
    const onChangeText = jest.fn((_text: string) => calls.push('onChangeText'));
    await render(<TextInput testID="input" onChange={onChange} onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(calls).toEqual(['onChange', 'onChangeText']);
    expect(onChangeText).toHaveBeenCalledWith('Hello');
    const event = onChange.mock.calls[0][0] as SyntheticEvent;
    expect(event.type).toBe('change');
    expect(event.target).toBe(screen.getByTestId('input'));
    expect(event.nativeEvent).toEqual({
      text: 'Hello',
      target: 0,
      eventCount: 0,
      selection: { start: 5, end: 5 },
    });
  });

  test('calls onChangeText after the input onChange, before ancestors onChange', async () => {
    const calls: string[] = [];
    await render(
      <View {...logChangeHandlers(calls, 'parent')}>
        <TextInput
          testID="input"
          {...logChangeHandlers(calls, 'input')}
          onChangeText={() => calls.push('input.onChangeText')}
        />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(calls).toEqual([
      'parent.onChangeCapture',
      'input.onChangeCapture',
      'input.onChange',
      'input.onChangeText',
      'parent.onChange',
    ]);
  });

  test('does not call onChangeText of an ancestor', async () => {
    const onChangeText = jest.fn();
    await render(
      <View {...{ onChangeText }}>
        <TextInput testID="input" />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('does not call onChange or onChangeText when a capture handler stops propagation', async () => {
    const onChange = jest.fn();
    const onChangeText = jest.fn();
    await render(
      <View {...{ onChangeCapture: (event: SyntheticEvent) => event.stopPropagation() }}>
        <TextInput testID="input" onChange={onChange} onChangeText={onChangeText} />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('calls onChangeText when the input onChange stops propagation', async () => {
    const onParentChange = jest.fn();
    const onChangeText = jest.fn();
    await render(
      <View {...{ onChange: onParentChange }}>
        <TextInput
          testID="input"
          onChange={(event) => event.stopPropagation()}
          onChangeText={onChangeText}
        />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChangeText).toHaveBeenCalledWith('Hello');
    expect(onParentChange).not.toHaveBeenCalled();
  });

  test('does not call onChangeText when the input onChange throws', async () => {
    const onChangeText = jest.fn();
    await render(
      <TextInput
        testID="input"
        onChange={() => {
          throw new Error('Change error');
        }}
        onChangeText={onChangeText}
      />,
    );

    await expect(fireEvent.changeText(screen.getByTestId('input'), 'Hello')).rejects.toThrow(
      'Change error',
    );
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('calls onChangeText without onChange', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  test('saves value of uncontrolled TextInput before handlers run', async () => {
    let value;
    const onChangeText = jest.fn(() => {
      value = nativeState.valueForInstance.get(screen.getByTestId('input'));
    });
    await render(<TextInput testID="input" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(value).toBe('Hello');
    expect(screen.getByTestId('input')).toHaveDisplayValue('Hello');
  });

  test('renders state updates from handlers', async () => {
    function Subject() {
      const [value, setValue] = React.useState('');
      return <TextInput testID="input" value={value} onChangeText={setValue} />;
    }

    await render(<Subject />);
    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(screen.getByTestId('input')).toHaveDisplayValue('Hello');
  });

  test('returns false when a handler calls preventDefault()', async () => {
    await render(<TextInput testID="input" onChange={(event) => event.preventDefault()} />);

    expect(await fireEvent.changeText(screen.getByTestId('input'), 'Hello')).toBe(false);
  });

  test('does nothing on non-editable TextInput', async () => {
    const onChange = jest.fn();
    const onChangeText = jest.fn();
    await render(
      <TextInput testID="input" editable={false} onChange={onChange} onChangeText={onChangeText} />,
    );
    const input = screen.getByTestId('input');

    expect(await fireEvent.changeText(input, 'Hello')).toBe(true);

    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
    expect(nativeState.valueForInstance.get(input)).toBeUndefined();
  });

  test('throws on elements other than TextInput', async () => {
    const onChangeText = jest.fn();
    await render(<View testID="view" {...{ onChangeText }} />);

    await expect(fireEvent.changeText(screen.getByTestId('view'), 'Hello')).rejects.toThrow(
      'Unable to fire a "changeText" event. Expected a host "TextInput" element, received "View".',
    );
    expect(onChangeText).not.toHaveBeenCalled();
  });

  test('throws when text is not a string', async () => {
    await render(<TextInput testID="input" />);

    await expect(
      fireEvent.changeText(screen.getByTestId('input'), 5 as unknown as string),
    ).rejects.toThrow(
      'Unable to fire a "changeText" event. Expected text to be a string, received number 5.',
    );
  });

  test('throws without an element', async () => {
    await expect(fireEvent.changeText(null as unknown as TestInstance, 'Hello')).rejects.toThrow(
      'Unable to fire a "changeText" event. Please provide a host element.',
    );
  });
});

describe('fireEvent.scroll', () => {
  test('passes default scroll payload as nativeEvent of a direct event', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('scroll'));

    const event: SyntheticEvent = onScroll.mock.calls[0][0];
    expect(event.type).toBe('scroll');
    expect(event.rnIsDirect).toBe(true);
    expect(event.nativeEvent).toEqual(defaultScrollPayload);
  });

  test('deep merges passed nativeEvent onto default payload', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('scroll'), {
      nativeEvent: { contentOffset: { y: 200 }, zoomScale: 2 },
    });

    expect(onScroll.mock.calls[0][0].nativeEvent).toEqual({
      ...defaultScrollPayload,
      contentOffset: { x: 0, y: 200 },
      zoomScale: 2,
    });
  });

  test('passes timeStamp to handlers', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('scroll'), { timeStamp: 123 });

    expect(onScroll.mock.calls[0][0].timeStamp).toBe(123);
  });

  test('saves content offset of ScrollView in native state', async () => {
    await render(<ScrollView testID="scroll" />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { x: 50 } } });
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({ x: 50, y: 0 });

    await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: Infinity } } });
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({ x: 0, y: 0 });
  });

  test('uses layout size of ScrollView as default layoutMeasurement', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent.layout(scrollView, { width: 390, height: 750 });
    await fireEvent.scroll(scrollView);
    await fireEvent.scroll(scrollView, {
      nativeEvent: { layoutMeasurement: { width: 100, height: 200 } },
    });

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 390,
      height: 750,
    });
    expect(onScroll.mock.calls[1][0].nativeEvent.layoutMeasurement).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('does not use layout size of other elements as layoutMeasurement', async () => {
    const onScroll = jest.fn();
    await render(<View testID="view" {...{ onScroll }} />);
    const view = screen.getByTestId('view');

    await fireEvent.layout(view, { width: 390, height: 750 });
    await fireEvent.scroll(view);

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 0,
      height: 0,
    });
  });

  test('does not call onScroll of an ancestor ScrollView', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView onScroll={onScroll}>
        <View testID="content" />
      </ScrollView>,
    );

    await fireEvent.scroll(screen.getByTestId('content'));

    expect(onScroll).not.toHaveBeenCalled();
  });

  test('uses default payload when the event object is undefined', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('scroll'), undefined);

    expect(onScroll.mock.calls[0][0].nativeEvent).toEqual(defaultScrollPayload);
  });

  test('validates the event object', async () => {
    await render(<ScrollView testID="scroll" />);

    await expect(
      fireEvent.scroll(screen.getByTestId('scroll'), { persist: () => {} } as FireEventInit),
    ).rejects.toThrow('Unable to fire a "scroll" event. Unsupported event object keys: "persist".');
  });

  test('throws without an element', async () => {
    await expect(fireEvent.scroll(null as unknown as TestInstance)).rejects.toThrow(
      'Unable to fire a "scroll" event. Please provide a host element.',
    );
  });
});

describe('fireEvent.layout', () => {
  test('passes zeroed layout as nativeEvent of a direct event', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'));

    const event: SyntheticEvent = onLayout.mock.calls[0][0];
    expect(event.type).toBe('layout');
    expect(event.rnIsDirect).toBe(true);
    expect(event.nativeEvent).toEqual({ layout: { x: 0, y: 0, width: 0, height: 0 }, target: 0 });
  });

  test('merges passed layout onto zeroed rectangle, with undefined fields as 0', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'), { width: 200, height: 80, x: undefined });

    expect(onLayout.mock.calls[0][0].nativeEvent.layout).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 80,
    });
  });

  test('saves layout size in native state, also without onLayout handler', async () => {
    await render(<View testID="view" />);
    const view = screen.getByTestId('view');

    await fireEvent.layout(view, { x: 10, y: 20, width: 100, height: 80 });

    expect(nativeState.layoutSizeForInstance.get(view)).toEqual({ width: 100, height: 80 });
  });

  test('does not call onLayout of an ancestor', async () => {
    const onLayout = jest.fn();
    await render(
      <View onLayout={onLayout}>
        <View testID="child" />
      </View>,
    );

    await fireEvent.layout(screen.getByTestId('child'), { height: 80 });

    expect(onLayout).not.toHaveBeenCalled();
  });

  test('does not call onLayout of composite component that does not forward it', async () => {
    const onLayout = jest.fn();
    const Box = (_props: { onLayout: () => void }) => <View testID="view" />;
    await render(<Box onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'));

    expect(onLayout).not.toHaveBeenCalled();
  });

  test('throws without an element', async () => {
    await expect(fireEvent.layout(null as unknown as TestInstance)).rejects.toThrow(
      'Unable to fire a "layout" event. Please provide a host element.',
    );
  });
});
