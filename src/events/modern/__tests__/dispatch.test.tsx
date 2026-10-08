import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { render, screen } from '../../..';
import { dispatchEvent } from '../dispatch';
import type { NativeEventPayload, SyntheticEvent } from '../event';
import { createEvent } from '../event';

function createKnownEvent(eventType: string, nativeEvent?: NativeEventPayload): SyntheticEvent {
  const event = createEvent(eventType, { nativeEvent });
  if (event == null) {
    throw new Error(`Unknown event type: ${eventType}`);
  }

  return event;
}

type HandlerProps = Record<string, (event: SyntheticEvent) => void>;

type Call = {
  prop: string;
  currentTarget: string | undefined;
  target: string | undefined;
  eventPhase: number;
};

function logHandlers(calls: Call[], id: string, propNames: string[]): HandlerProps {
  return Object.fromEntries(
    propNames.map((propName) => [
      propName,
      (event: SyntheticEvent) => {
        calls.push({
          prop: `${id}.${propName}`,
          currentTarget: event.currentTarget?.props.testID,
          target: event.target?.props.testID,
          eventPhase: event.eventPhase,
        });
      },
    ]),
  );
}

/** Lets handler props be spread on `View`, whose types don't include all of them. */
function handlerProps(props: HandlerProps): HandlerProps {
  return props;
}

function getProps(calls: Call[]) {
  return calls.map((call) => call.prop);
}

function renderNestedViews(propNames: string[], calls: Call[]) {
  return render(
    <View testID="root" {...logHandlers(calls, 'root', propNames)}>
      <View testID="parent" {...logHandlers(calls, 'parent', propNames)}>
        <View testID="target" {...logHandlers(calls, 'target', propNames)} />
      </View>
    </View>,
  );
}

describe('bubbling events', () => {
  test('run capture phase from the root, then bubble phase to the root', async () => {
    const calls: Call[] = [];
    await renderNestedViews(['onFocus', 'onFocusCapture'], calls);

    await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

    expect(calls).toEqual([
      { prop: 'root.onFocusCapture', currentTarget: 'root', target: 'target', eventPhase: 1 },
      { prop: 'parent.onFocusCapture', currentTarget: 'parent', target: 'target', eventPhase: 1 },
      { prop: 'target.onFocusCapture', currentTarget: 'target', target: 'target', eventPhase: 2 },
      { prop: 'target.onFocus', currentTarget: 'target', target: 'target', eventPhase: 2 },
      { prop: 'parent.onFocus', currentTarget: 'parent', target: 'target', eventPhase: 3 },
      { prop: 'root.onFocus', currentTarget: 'root', target: 'target', eventPhase: 3 },
    ]);
  });

  test('call handlers on all host ancestors, skipping elements without handler', async () => {
    const onSubmitEditing = jest.fn();
    await render(
      <View {...handlerProps({ onSubmitEditing })}>
        <View>
          <TextInput testID="input" />
        </View>
      </View>,
    );

    await dispatchEvent(
      screen.getByTestId('input'),
      createKnownEvent('submitEditing', { text: 'Hello' }),
    );

    expect(onSubmitEditing).toHaveBeenCalledTimes(1);
    expect(onSubmitEditing.mock.calls[0][0].nativeEvent).toEqual({ text: 'Hello' });
  });

  test('stop when a capture handler stops propagation', async () => {
    const calls: Call[] = [];
    await render(
      <View testID="root" {...logHandlers(calls, 'root', ['onFocus'])}>
        <View
          testID="parent"
          {...handlerProps({
            onFocusCapture: (event: SyntheticEvent) => {
              calls.push({ prop: 'parent.onFocusCapture' } as Call);
              event.stopPropagation();
            },
          })}
        >
          <View testID="target" {...logHandlers(calls, 'target', ['onFocus', 'onFocusCapture'])} />
        </View>
      </View>,
    );

    await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

    expect(getProps(calls)).toEqual(['parent.onFocusCapture']);
  });

  test.each(['stopPropagation', 'stopImmediatePropagation'] as const)(
    'stop when a bubble handler calls %s()',
    async (method) => {
      const calls: Call[] = [];
      await render(
        <View testID="root" {...logHandlers(calls, 'root', ['onFocus'])}>
          <View
            testID="parent"
            {...handlerProps({
              onFocus: (event: SyntheticEvent) => {
                calls.push({ prop: 'parent.onFocus' } as Call);
                event[method]();
              },
            })}
          >
            <View testID="target" {...logHandlers(calls, 'target', ['onFocus'])} />
          </View>
        </View>,
      );

      await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

      expect(getProps(calls)).toEqual(['target.onFocus', 'parent.onFocus']);
    },
  );

  test('with skipBubbling run capture phase, but call only the target when bubbling', async () => {
    const calls: Call[] = [];
    await renderNestedViews(['onPointerEnter', 'onPointerEnterCapture'], calls);

    await dispatchEvent(screen.getByTestId('target'), createKnownEvent('pointerEnter'));

    expect(getProps(calls)).toEqual([
      'root.onPointerEnterCapture',
      'parent.onPointerEnterCapture',
      'target.onPointerEnterCapture',
      'target.onPointerEnter',
    ]);
  });
});

describe('direct events', () => {
  test('call only the target, without capture phase', async () => {
    const calls: Call[] = [];
    await renderNestedViews(['onLayout', 'onLayoutCapture'], calls);

    await dispatchEvent(screen.getByTestId('target'), createKnownEvent('layout'));

    expect(calls).toEqual([
      { prop: 'target.onLayout', currentTarget: 'target', target: 'target', eventPhase: 2 },
    ]);
  });

  test('do not reach ancestors when the target has no handler', async () => {
    const onScroll = jest.fn();
    await render(
      <View {...handlerProps({ onScroll })}>
        <View testID="target" />
      </View>,
    );

    await dispatchEvent(screen.getByTestId('target'), createKnownEvent('scroll'));

    expect(onScroll).not.toHaveBeenCalled();
  });
});

test('does not call props of composite components', async () => {
  const onFocus = jest.fn();
  const Box = (_props: { onFocus: () => void }) => <View testID="target" />;
  await render(<Box onFocus={onFocus} />);

  await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

  expect(onFocus).not.toHaveBeenCalled();
});

test('does nothing when the target is unmounted', async () => {
  const onFocus = jest.fn();
  await render(<View testID="target" {...handlerProps({ onFocus })} />);
  const target = screen.getByTestId('target');
  await screen.rerender(<View />);

  const result = await dispatchEvent(target, createKnownEvent('focus'));

  expect(result).toBe(true);
  expect(onFocus).not.toHaveBeenCalled();
});

test('passes React Native event object to handlers', async () => {
  const onPointerUp = jest.fn();
  await render(<View testID="target" {...handlerProps({ onPointerUp })} />);
  const target = screen.getByTestId('target');
  const payload = { pageX: 10, pageY: 20, timestamp: 1234 };

  await dispatchEvent(target, createKnownEvent('pointerUp', payload));

  const event: SyntheticEvent = onPointerUp.mock.calls[0][0];
  expect(event.type).toBe('pointerup');
  expect(event.bubbles).toBe(true);
  expect(event.cancelable).toBe(true);
  expect(event.isTrusted).toBe(true);
  expect(event.nativeEvent).toBe(payload);
  expect(event.timeStamp).toBe(1234);
  expect(event.target).toBe(target);
  expect(event.dispatchConfig).toEqual({
    phasedRegistrationNames: { bubbled: 'onPointerUp', captured: 'onPointerUpCapture' },
  });
});

test('passes direct event object to handlers', async () => {
  const onLayout = jest.fn();
  await render(<View testID="target" onLayout={onLayout} />);

  await dispatchEvent(
    screen.getByTestId('target'),
    createKnownEvent('layout', { layout: { width: 100 } }),
  );

  const event: SyntheticEvent = onLayout.mock.calls[0][0];
  expect(event.type).toBe('layout');
  expect(event.bubbles).toBe(false);
  expect(event.rnIsDirect).toBe(true);
  expect(event.dispatchConfig).toEqual({ registrationName: 'onLayout' });
});

test('exposes composed path during dispatch and resets the event after it', async () => {
  let composedPath: TestInstance[] = [];
  const onFocus = jest.fn((event: SyntheticEvent) => {
    composedPath = event.composedPath();
  });
  await render(
    <View testID="root">
      <View testID="target" {...handlerProps({ onFocus })} />
    </View>,
  );

  await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

  expect(composedPath.map((node) => node.props.testID)).toEqual(['target', 'root']);
  const event: SyntheticEvent = onFocus.mock.calls[0][0];
  expect(event.currentTarget).toBeNull();
  expect(event.eventPhase).toBe(0);
  expect(event.composedPath()).toEqual([]);
  expect(event.isPropagationStopped()).toBe(false);
  expect(event.target).toBe(screen.getByTestId('target'));
});

test('calls handlers with the current element as `this`', async () => {
  const onFocus = jest.fn();
  await render(<View testID="target" {...handlerProps({ onFocus })} />);

  await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

  expect(onFocus.mock.contexts[0]).toBe(screen.getByTestId('target'));
});

test('returns false when a handler prevents default', async () => {
  await render(
    <View
      testID="target"
      {...handlerProps({ onFocus: (event: SyntheticEvent) => event.preventDefault() })}
    />,
  );

  const result = await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

  expect(result).toBe(false);
});

test('rethrows the first handler error after calling all handlers', async () => {
  const onRootFocus = jest.fn();
  await render(
    <View testID="root" {...handlerProps({ onFocus: onRootFocus })}>
      <View
        {...handlerProps({
          onFocus: () => {
            throw new Error('Parent error');
          },
        })}
      >
        <View
          testID="target"
          {...handlerProps({
            onFocus: () => {
              throw new Error('Target error');
            },
          })}
        />
      </View>
    </View>,
  );

  await expect(
    dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus')),
  ).rejects.toThrow('Target error');
  expect(onRootFocus).toHaveBeenCalledTimes(1);
});

test('renders state updates from all handlers once', async () => {
  let renderCount = 0;
  function Counter() {
    const [parentCount, setParentCount] = React.useState(0);
    const [targetCount, setTargetCount] = React.useState(0);
    renderCount += 1;

    return (
      <View {...handlerProps({ onFocus: () => setParentCount((count) => count + 1) })}>
        <View
          testID="target"
          {...handlerProps({ onFocus: () => setTargetCount((count) => count + 1) })}
        >
          <Text>{`${parentCount}:${targetCount}`}</Text>
        </View>
      </View>
    );
  }
  await render(<Counter />);
  const initialRenderCount = renderCount;

  await dispatchEvent(screen.getByTestId('target'), createKnownEvent('focus'));

  expect(screen.getByText('1:1')).toBeTruthy();
  expect(renderCount - initialRenderCount).toBe(1);
});
