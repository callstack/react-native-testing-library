import * as React from 'react';
import type { TextInputProps } from 'react-native';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { fireEvent, render, screen } from '../../..';
import { configure, getConfig } from '../../../config';
import { _console, logger } from '../../../helpers/logger';
import { SyntheticEvent } from '../../modern/event';
import { getEventHandlerName } from '../../shared/handler';
import { nativeState } from '../../shared/native-state';

// Runs in both event systems, through the public `fireEvent`. Where they differ, tests branch on
// `isModern()`, with a comment saying which one matches React Native.

const emptyEvent = { nativeEvent: {} };
const layoutEvent = { nativeEvent: { layout: { width: 100, height: 100 } } };
const verticalScrollEvent = { nativeEvent: { contentOffset: { y: 200 } } };
const horizontalScrollEvent = { nativeEvent: { contentOffset: { x: 50 } } };
const pressEventData = { nativeEvent: { pageX: 20, pageY: 30 } };

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
});

function isModern() {
  return getConfig().unstable_eventSystem === 'modern';
}

/** Error message `fireEvent` rejects with, or `undefined` when it resolves. */
async function getErrorMessage(promise: Promise<unknown>) {
  try {
    await promise;
    return undefined;
  } catch (error) {
    return (error as Error).message;
  }
}

test('fireEvent accepts event name with or without "on" prefix', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);

  await fireEvent(screen.getByTestId('btn'), 'press', emptyEvent);
  expect(onPress).toHaveBeenCalledTimes(1);

  await fireEvent(screen.getByTestId('btn'), 'onPress', emptyEvent);
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('fireEvent does not call handler props without the "on" prefix (legacy: calls them for unprefixed event names)', async () => {
  const press = jest.fn();
  const testOnlyPress = jest.fn();
  // @ts-expect-error Intentionally passing such props
  await render(<View testID="view" press={press} testOnly_press={testOnlyPress} />);

  await fireEvent(screen.getByTestId('view'), 'onPress', emptyEvent);
  expect(press).not.toHaveBeenCalled();
  expect(testOnlyPress).not.toHaveBeenCalled();

  // Modern matches React Native, where only Pressability calls press callbacks. Legacy calls any
  // `press` prop.
  await fireEvent(screen.getByTestId('view'), 'press', emptyEvent);
  expect(press).toHaveBeenCalledTimes(isModern() ? 0 : 1);
});

test('fireEvent passes event data to handler', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);
  await fireEvent.press(screen.getByTestId('btn'), pressEventData);
  expect(onPress.mock.calls[0][0]).toMatchObject(pressEventData);
});

test('fireEvent throws with more than one event argument (legacy: passes them all to the handler)', async () => {
  const handlePress = jest.fn();
  await render(<Pressable testID="btn" onPress={handlePress} />);
  const error = await getErrorMessage(
    fireEvent(screen.getByTestId('btn'), 'press', 'param1', 'param2', 'param3'),
  );
  // Modern matches React Native, where handlers receive a single event.
  expect(error).toBe(
    isModern()
      ? 'Unable to fire a "press" event. Expected a single event object, received 3 arguments.'
      : undefined,
  );
  expect(handlePress.mock.calls).toEqual(isModern() ? [] : [['param1', 'param2', 'param3']]);
});

test('fireEvent.press resolves to undefined when event handler returns a value', async () => {
  const handler = jest.fn().mockReturnValue('result');
  await render(<Pressable testID="btn" onPress={handler} />);
  await expect(fireEvent.press(screen.getByTestId('btn'))).resolves.toBeUndefined();
});

test('fireEvent bubbles event to parent handler', async () => {
  const onPress = jest.fn();
  await render(
    <TouchableOpacity onPress={onPress}>
      <Text>Press me</Text>
    </TouchableOpacity>,
  );
  await fireEvent.press(screen.getByText('Press me'));
  expect(onPress).toHaveBeenCalled();
});

describe('fireEvent.press', () => {
  test('passes a SyntheticEvent with default touch payload to handler (legacy: a plain event object)', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="btn" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('btn'));
    expect(onPress.mock.calls[0][0].nativeEvent).toMatchInlineSnapshot(`
      {
        "changedTouches": [],
        "identifier": 0,
        "locationX": 0,
        "locationY": 0,
        "pageX": 0,
        "pageY": 0,
        "target": 0,
        "timestamp": 100100100100,
        "touches": [],
      }
    `);
    // Modern matches React Native, which passes a `SyntheticEvent`. Legacy passes a plain object
    // with stubs of its methods.
    expect(onPress.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern());
    if (isModern()) return;
    expect({ ...onPress.mock.calls[0][0], nativeEvent: undefined }).toMatchInlineSnapshot(`
      {
        "currentTarget": {
          "measure": [Function],
        },
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": undefined,
        "persist": [Function],
        "preventDefault": [Function],
        "stopPropagation": [Function],
        "target": {},
        "timeStamp": 0,
      }
    `);
  });

  test('overrides default event properties with passed event props', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="btn" onPress={onPress} />);
    const customEventData = { nativeEvent: { pageX: 20, pageY: 30 } };
    await fireEvent.press(screen.getByTestId('btn'), customEventData);
    expect(onPress.mock.calls[0][0].nativeEvent).toMatchInlineSnapshot(`
      {
        "changedTouches": [],
        "identifier": 0,
        "locationX": 0,
        "locationY": 0,
        "pageX": 20,
        "pageY": 30,
        "target": 0,
        "timestamp": 100100100100,
        "touches": [],
      }
    `);
  });

  test.each([
    ['Pressable', Pressable],
    ['TouchableOpacity', TouchableOpacity],
    ['TouchableHighlight', TouchableHighlight],
    ['TouchableWithoutFeedback', TouchableWithoutFeedback],
    ['TouchableNativeFeedback', TouchableNativeFeedback],
  ])('works on %s', async (_, Component) => {
    const onPress = jest.fn();
    await render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Component is a valid React component - but some RN versions have incorrect type definitions
      <Component testID="subject" onPress={onPress}>
        <Text>Press me</Text>
      </Component>,
    );
    await fireEvent.press(screen.getByTestId('subject'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works with testOnly_onPress handlers', async () => {
    const onPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const onLongPress = jest.fn();
    const testOnlyPressProps = {
      testOnly_onPress: onPress,
      testOnly_onPressIn: onPressIn,
      testOnly_onPressOut: onPressOut,
      testOnly_onLongPress: onLongPress,
    };

    await render(<View testID="subject" {...testOnlyPressProps} />);

    const subject = screen.getByTestId('subject');

    await fireEvent.press(subject);
    expect(onPress).toHaveBeenCalledTimes(1);

    await fireEvent(subject, 'pressIn', emptyEvent);
    expect(onPressIn).toHaveBeenCalledTimes(1);

    await fireEvent(subject, 'pressOut', emptyEvent);
    expect(onPressOut).toHaveBeenCalledTimes(1);

    await fireEvent(subject, 'longPress', emptyEvent);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});

describe('fireEvent.changeText', () => {
  test('works on TextInput', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    await fireEvent.changeText(input, 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
    expect(nativeState.valueForInstance.get(input)).toBe('new text');
  });

  test('throws when fired as `onChangeText` (legacy: calls it and updates native state)', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    const error = await getErrorMessage(fireEvent(input, 'onChangeText', 'new text'));
    // Modern matches React Native: `changeText` isn't a native event, TextInput calls
    // `onChangeText` from its `onChange`. Use `fireEvent.changeText()` in both.
    expect(error).toBe(
      isModern()
        ? `Unable to fire a "changeText" event. React Native doesn't dispatch "changeText" natively. Use fireEvent.changeText() or userEvent.type() instead.`
        : undefined,
    );
    expect(onChangeText.mock.calls).toEqual(isModern() ? [] : [['new text']]);
    expect(nativeState.valueForInstance.get(input)).toBe(isModern() ? undefined : 'new text');
  });

  test('does not fire on non-editable TextInput', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" editable={false} onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    await fireEvent.changeText(input, 'new text');
    expect(onChangeText).not.toHaveBeenCalled();
    expect(nativeState.valueForInstance.get(input)).toBeUndefined();
  });
});

test('change event saves value of TextInput in native state', async () => {
  await render(<TextInput testID="input" />);
  const input = screen.getByTestId('input');

  await fireEvent(input, 'change', { nativeEvent: { text: 'new text' } });

  expect(nativeState.valueForInstance.get(input)).toBe('new text');
});

describe('fireEvent.scroll', () => {
  test('passes a SyntheticEvent with default scroll payload to handler (legacy: a plain event object)', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView);
    expect(onScroll.mock.calls[0][0].nativeEvent).toMatchInlineSnapshot(`
      {
        "contentInset": {
          "bottom": 0,
          "left": 0,
          "right": 0,
          "top": 0,
        },
        "contentOffset": {
          "x": 0,
          "y": 0,
        },
        "contentSize": {
          "height": 0,
          "width": 0,
        },
        "layoutMeasurement": {
          "height": 0,
          "width": 0,
        },
        "responderIgnoreScroll": true,
        "target": 0,
        "velocity": {
          "x": 0,
          "y": 0,
        },
      }
    `);
    // Modern matches React Native, which passes a `SyntheticEvent`. Legacy passes a plain object
    // with stubs of its methods.
    expect(onScroll.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern());
    if (isModern()) return;
    expect({ ...onScroll.mock.calls[0][0], nativeEvent: undefined }).toMatchInlineSnapshot(`
      {
        "currentTarget": {},
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": undefined,
        "persist": [Function],
        "preventDefault": [Function],
        "stopPropagation": [Function],
        "target": {},
        "timeStamp": 0,
      }
    `);
  });

  test('overrides default event properties with passed event props', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    const customEventData = {
      nativeEvent: { contentOffset: { x: 50, y: 200 } },
    };
    await fireEvent.scroll(scrollView, customEventData);
    expect(onScroll.mock.calls[0][0].nativeEvent).toMatchInlineSnapshot(`
      {
        "contentInset": {
          "bottom": 0,
          "left": 0,
          "right": 0,
          "top": 0,
        },
        "contentOffset": {
          "x": 50,
          "y": 200,
        },
        "contentSize": {
          "height": 0,
          "width": 0,
        },
        "layoutMeasurement": {
          "height": 0,
          "width": 0,
        },
        "responderIgnoreScroll": true,
        "target": 0,
        "velocity": {
          "x": 0,
          "y": 0,
        },
      }
    `);
  });

  test('works on ScrollView', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, verticalScrollEvent);
    expect(onScroll.mock.calls[0][0]).toMatchObject(verticalScrollEvent);
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 200,
    });
  });

  test('updates native state when fired with `on*` prefixed name', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'onScroll', verticalScrollEvent);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(onScroll.mock.calls[0][0]).toMatchObject(verticalScrollEvent);
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 200,
    });
  });

  test.each([
    ['onScroll', 'scroll'],
    ['onScrollBeginDrag', 'scrollBeginDrag'],
    ['onScrollEndDrag', 'scrollEndDrag'],
    ['onMomentumScrollBegin', 'momentumScrollBegin'],
    ['onMomentumScrollEnd', 'momentumScrollEnd'],
  ])('fires %s on ScrollView', async (propName, eventType) => {
    const handler = jest.fn();
    await render(<ScrollView testID="scroll" {...{ [propName]: handler }} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, eventType, verticalScrollEvent);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0]).toMatchObject(verticalScrollEvent);
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 200,
    });
  });

  test('without contentOffset scrolls to (0, 0)', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {});
    expect(onScroll.mock.calls[0][0]).toMatchObject({
      nativeEvent: { contentOffset: { x: 0, y: 0 } },
    });
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 0,
    });
  });

  test('with non-finite contentOffset values uses 0', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { y: Infinity } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 0,
    });
  });

  test('with horizontal scroll updates native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, horizontalScrollEvent);
    expect(onScroll.mock.calls[0][0]).toMatchObject(horizontalScrollEvent);
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 50,
      y: 0,
    });
  });

  test('without contentOffset via fireEvent() does not update native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'scroll', { nativeEvent: {} });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toBeUndefined();
  });

  test('with non-finite x contentOffset value uses 0', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { x: Infinity } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForInstance.get(scrollView)).toEqual({
      x: 0,
      y: 0,
    });
  });

  test('uses layout size from previous layout event as layoutMeasurement', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} onLayout={() => {}} />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent.layout(scrollView, { width: 390, height: 750 });
    await fireEvent.scroll(scrollView);

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 390,
      height: 750,
    });
  });

  test('prefers passed layoutMeasurement over layout size from layout event', async () => {
    const onScroll = jest.fn();
    await render(<ScrollView testID="scroll" onScroll={onScroll} onLayout={() => {}} />);
    const scrollView = screen.getByTestId('scroll');

    await fireEvent.layout(scrollView, { width: 390, height: 750 });
    await fireEvent.scroll(scrollView, {
      nativeEvent: { layoutMeasurement: { width: 100, height: 200 } },
    });

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 100,
      height: 200,
    });
  });

  test('does not use layout size of non-ScrollView element as layoutMeasurement', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView>
        {/* Spread because `View` types don't include `onScroll`. */}
        <View testID="content" onLayout={() => {}} {...{ onScroll }} />
      </ScrollView>,
    );
    const content = screen.getByTestId('content');

    await fireEvent.layout(content, { width: 390, height: 750 });
    await fireEvent.scroll(content);

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 0,
      height: 0,
    });
  });
});

describe('fireEvent.layout', () => {
  test('passes a SyntheticEvent with default layout payload to handler (legacy: a plain event object)', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'));

    expect(onLayout.mock.calls[0][0].nativeEvent).toMatchInlineSnapshot(`
      {
        "layout": {
          "height": 0,
          "width": 0,
          "x": 0,
          "y": 0,
        },
        "target": 0,
      }
    `);
    // Modern matches React Native, which passes a `SyntheticEvent`. Legacy passes a plain object
    // with stubs of its methods.
    expect(onLayout.mock.calls[0][0] instanceof SyntheticEvent).toBe(isModern());
    if (isModern()) return;
    expect({ ...onLayout.mock.calls[0][0], nativeEvent: undefined }).toMatchInlineSnapshot(`
      {
        "currentTarget": {},
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": undefined,
        "persist": [Function],
        "preventDefault": [Function],
        "stopPropagation": [Function],
        "target": {},
        "timeStamp": 0,
      }
    `);
  });

  test('merges the passed layout onto the zeroed rectangle', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'), { width: 200, height: 80 });

    expect(onLayout.mock.calls[0][0].nativeEvent).toEqual({
      layout: { x: 0, y: 0, width: 200, height: 80 },
      target: 0,
    });
  });

  test('uses zero for layout fields passed as undefined', async () => {
    configure({ eventDiagnostics: true });
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    const onLayout = jest.fn();
    await render(
      <View>
        <View testID="with-handler" onLayout={onLayout} />
        <View testID="without-handler" />
      </View>,
    );
    const withoutHandler = screen.getByTestId('without-handler');

    await fireEvent.layout(screen.getByTestId('with-handler'), { x: undefined, width: undefined });
    await fireEvent.layout(withoutHandler, { width: undefined, height: undefined });

    expect(onLayout.mock.calls[0][0].nativeEvent.layout).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    expect(nativeState.layoutSizeForInstance.get(withoutHandler)).toEqual({ width: 0, height: 0 });
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test('does not bubble to the handler on an ancestor element', async () => {
    const onLayout = jest.fn();
    await render(
      <View testID="parent" onLayout={onLayout}>
        <View testID="child" />
      </View>,
    );

    await fireEvent.layout(screen.getByTestId('child'), { height: 80 });

    expect(onLayout).not.toHaveBeenCalled();
  });

  test('does not bubble when fired as generic layout event (legacy: bubbles with a warning)', async () => {
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    const onLayout = jest.fn();
    await render(
      <View testID="parent" onLayout={onLayout}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'layout', layoutEvent);
    await fireEvent(screen.getByTestId('child'), 'onLayout', layoutEvent);

    // Modern matches React Native: layout is a direct event, so it doesn't bubble. Legacy still
    // bubbles it, with a warning.
    expect(onLayout).toHaveBeenCalledTimes(isModern() ? 0 : 2);
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 2);
    warnSpy.mockRestore();
  });

  test('does not warn when layout size is saved in native state without onLayout handler', async () => {
    configure({ eventDiagnostics: true });
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    await render(<View testID="view" />);

    await fireEvent.layout(screen.getByTestId('view'));

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test('is not blocked by element responder rejecting touches', async () => {
    const onLayout = jest.fn();
    await render(
      <View testID="view" onLayout={onLayout} onStartShouldSetResponder={() => false} />,
    );

    await fireEvent.layout(screen.getByTestId('view'));

    expect(onLayout).toHaveBeenCalledTimes(1);
  });

  test('saves layout size in native state', async () => {
    await render(<View testID="view" onLayout={() => {}} />);
    const view = screen.getByTestId('view');

    await fireEvent.layout(view, { x: 10, y: 20, width: 100, height: 80 });
    expect(nativeState.layoutSizeForInstance.get(view)).toEqual({ width: 100, height: 80 });

    await fireEvent(view, 'layout', { nativeEvent: { layout: { width: 50, height: NaN } } });
    expect(nativeState.layoutSizeForInstance.get(view)).toEqual({ width: 50, height: 0 });
  });

  test('saves layout size in native state even without onLayout handler', async () => {
    await render(<View testID="view" />);
    const view = screen.getByTestId('view');

    await fireEvent.layout(view, { width: 100, height: 80 });

    expect(nativeState.layoutSizeForInstance.get(view)).toEqual({ width: 100, height: 80 });
  });

  test('does not call onLayout of composite component that does not forward it', async () => {
    const onLayout = jest.fn();
    const Box = (_props: { onLayout: () => void }) => <View testID="view" />;
    await render(<Box onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'));

    expect(onLayout).not.toHaveBeenCalled();
  });
});

describe('direct events', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  type DirectEventCase = {
    name: string;
    eventType: string;
    ui: (handler: jest.Mock) => React.ReactElement;
  };

  const directEventCases: DirectEventCase[] = [
    {
      name: 'layout from View content',
      eventType: 'layout',
      ui: (handler) => (
        <View testID="emitter" onLayout={handler}>
          <View testID="target" />
        </View>
      ),
    },
    {
      name: 'accessibilityAction from Pressable content',
      eventType: 'accessibilityAction',
      ui: (handler) => (
        <Pressable
          testID="emitter"
          accessibilityActions={[{ name: 'activate' }]}
          onAccessibilityAction={handler}
        >
          <Text testID="target">Button</Text>
        </Pressable>
      ),
    },
    ...buildDirectEventCases(
      'View content',
      ['accessibilityTap', 'magicTap', 'accessibilityEscape'],
      (handlerProps) => (
        <View testID="emitter" accessible {...handlerProps}>
          <View testID="target" />
        </View>
      ),
    ),
    {
      name: 'textLayout from nested Text',
      eventType: 'textLayout',
      ui: (handler) => (
        <Text testID="emitter" onTextLayout={handler}>
          <Text testID="target">Nested</Text>
        </Text>
      ),
    },
    ...buildDirectEventCases(
      'TextInput content',
      ['scroll', 'selectionChange', 'contentSizeChange'],
      (handlerProps) => (
        <TextInput testID="emitter" {...handlerProps}>
          <Text testID="target">Nested</Text>
        </TextInput>
      ),
    ),
    ...buildDirectEventCases(
      'Image content',
      ['loadStart', 'progress', 'partialLoad', 'load', 'error', 'loadEnd'],
      // Image does not accept children, clone it to fire the event on a nested element.
      (handlerProps) =>
        React.cloneElement(
          <Image
            testID="emitter"
            source={{ uri: 'https://example.com/image.png' }}
            {...handlerProps}
          />,
          {},
          <Text testID="target">Nested</Text>,
        ),
    ),
    ...buildDirectEventCases(
      'ScrollView content',
      [
        'scroll',
        'scrollBeginDrag',
        'scrollEndDrag',
        'momentumScrollBegin',
        'momentumScrollEnd',
        'scrollToTop',
        'contentSizeChange',
      ],
      (handlerProps) => (
        <ScrollView testID="emitter" {...handlerProps}>
          <View testID="target" />
        </ScrollView>
      ),
    ),
    {
      name: 'scroll from TextInput to ancestor ScrollView',
      eventType: 'scroll',
      ui: (handler) => (
        <ScrollView testID="emitter" onScroll={handler}>
          <TextInput testID="target" />
        </ScrollView>
      ),
    },
    {
      name: 'refresh from FlatList item',
      eventType: 'refresh',
      ui: (handler) => (
        <FlatList
          testID="emitter"
          data={['Item']}
          renderItem={({ item }) => <Text testID="target">{item}</Text>}
          refreshing={false}
          onRefresh={handler}
        />
      ),
    },
    {
      name: 'contentSizeChange from FlatList item',
      eventType: 'contentSizeChange',
      ui: (handler) => (
        <FlatList
          testID="emitter"
          data={['Item']}
          renderItem={({ item }) => <Text testID="target">{item}</Text>}
          onContentSizeChange={handler}
        />
      ),
    },
    ...buildDirectEventCases(
      'Modal content',
      ['requestClose', 'show', 'dismiss', 'orientationChange'],
      (handlerProps) => (
        <Modal testID="emitter" visible {...handlerProps}>
          <Text testID="target">Content</Text>
        </Modal>
      ),
    ),
  ];

  // Builds one case per event type, passing the matching `on*` handler prop to `ui`.
  function buildDirectEventCases(
    source: string,
    eventTypes: string[],
    ui: (handlerProps: Record<string, jest.Mock>) => React.ReactElement,
  ): DirectEventCase[] {
    return eventTypes.map((eventType) => ({
      name: `${eventType} from ${source}`,
      eventType,
      ui: (handler) => ui({ [getEventHandlerName(eventType)]: handler }),
    }));
  }

  test.each(directEventCases)(
    'does not bubble $name (legacy: bubbles with a warning)',
    async ({ eventType, ui }) => {
      const handler = jest.fn();
      await render(ui(handler));

      await fireEvent(screen.getByTestId('target'), eventType, emptyEvent);

      // Modern matches React Native: direct events don't bubble. Legacy still bubbles them, with a
      // warning.
      expect(handler).toHaveBeenCalledTimes(isModern() ? 0 : 1);
      expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    },
  );

  test.each(directEventCases)(
    'does not warn for $name when fired on the emitting element',
    async ({ eventType, ui }) => {
      const handler = jest.fn();
      await render(ui(handler));

      await fireEvent(screen.getByTestId('emitter'), eventType, emptyEvent);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    },
  );

  test('does not bubble when fired with "on" prefixed event name (legacy: bubbles with a warning)', async () => {
    const onMomentumScrollEnd = jest.fn();
    await render(
      <ScrollView onMomentumScrollEnd={onMomentumScrollEnd}>
        <View testID="child" />
      </ScrollView>,
    );

    await fireEvent(screen.getByTestId('child'), 'onMomentumScrollEnd', emptyEvent);

    // Modern matches React Native: direct events don't bubble. Legacy still bubbles them, with a
    // warning.
    expect(onMomentumScrollEnd).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
  });

  test('does not bubble scroll (legacy: warns about stopping bubbling in the next major version)', async () => {
    await render(
      <ScrollView testID="scroll" onScroll={() => {}}>
        <View testID="child" />
      </ScrollView>,
    );

    await fireEvent.scroll(screen.getByTestId('child'));

    // Modern matches React Native: direct events don't bubble. Legacy still bubbles them, with a
    // warning.
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    if (isModern()) return;
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "  ▲ fireEvent: "scroll" does not bubble in React Native. fireEvent will stop bubbling it in the next major version. Fire it on:

            <RCTScrollView
              testID="scroll"
            />
      "
    `);
  });

  test.each([true, false])(
    'does not bubble regardless of eventDiagnostics (%s) (legacy: always warns about bubbling)',
    async (eventDiagnostics) => {
      configure({ eventDiagnostics });
      await render(
        <ScrollView onScroll={() => {}}>
          <View testID="child" />
        </ScrollView>,
      );

      await fireEvent.scroll(screen.getByTestId('child'));

      // Modern matches React Native: direct events don't bubble. Legacy still bubbles them, with
      // a warning. Modern warns that the child has no handler, when `eventDiagnostics` is on.
      const bubblingWarnings = warnSpy.mock.calls.filter(([message]) =>
        message.includes('"scroll" does not bubble in React Native'),
      );
      const unhandledWarnings = warnSpy.mock.calls.filter(([message]) =>
        message.includes('No "onScroll" handler found on the element.'),
      );
      expect(bubblingWarnings).toHaveLength(isModern() ? 0 : 1);
      expect(unhandledWarnings).toHaveLength(isModern() && eventDiagnostics ? 1 : 0);
      expect(warnSpy).toHaveBeenCalledTimes(isModern() && !eventDiagnostics ? 0 : 1);
    },
  );

  test('does not call handler on composite component above the emitting element (legacy: calls it with a warning)', async () => {
    const onScroll = jest.fn();
    const Screen = (_props: { onScroll: () => void }) => (
      <ScrollView>
        <View testID="child" />
      </ScrollView>
    );
    await render(<Screen onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('child'));

    // Modern matches React Native: scroll doesn't bubble, and composite props are never called.
    // Legacy calls the composite prop, with a warning.
    expect(onScroll).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
  });

  // Known gap: only the type of the element with the handler is checked.
  test('does not call handler on an element that does not emit the event (legacy: calls it without a warning)', async () => {
    const onScroll = jest.fn();
    const Screen = (_props: { onScroll: () => void }) => (
      <View>
        <ScrollView>
          <View testID="child" />
        </ScrollView>
      </View>
    );
    await render(<Screen onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('child'));

    // Modern matches React Native: scroll doesn't bubble, and composite props are never called.
    expect(onScroll).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not call composite component handlers (legacy: calls them without a warning)', async () => {
    const onLoad = jest.fn();
    const onShow = jest.fn();
    const Card = (_props: { onLoad: () => void; onShow: () => void }) => (
      <View>
        <Text>Card</Text>
      </View>
    );
    await render(<Card onLoad={onLoad} onShow={onShow} />);

    await fireEvent(screen.getByText('Card'), 'load', emptyEvent);
    await fireEvent(screen.getByText('Card'), 'show', emptyEvent);

    // Modern matches React Native: composite props are never called, and these events don't
    // bubble.
    expect(onLoad).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(onShow).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not bubble to host element that does not emit the event (legacy: bubbles without a warning)', async () => {
    const onLoad = jest.fn();
    await render(
      // @ts-expect-error View does not have onLoad prop
      <View onLoad={onLoad}>
        <Text>Content</Text>
      </View>,
    );

    await fireEvent(screen.getByText('Content'), 'load', emptyEvent);

    // Modern matches React Native: load is a direct event, so it doesn't bubble.
    expect(onLoad).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not bubble load event to ImageBackground handler (legacy: bubbles without a warning)', async () => {
    const onLoad = jest.fn();
    await render(
      <ImageBackground source={{ uri: 'https://example.com/image.png' }} onLoad={onLoad}>
        <Text>Caption</Text>
      </ImageBackground>,
    );

    await fireEvent(screen.getByText('Caption'), 'load', emptyEvent);

    // Modern matches React Native: load doesn't bubble, and ImageBackground passes `onLoad` to its
    // Image, which isn't an ancestor of the caption.
    expect(onLoad).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

test('fireEvent throws for custom event (onCustomEvent) on composite component (legacy: calls it)', async () => {
  const CustomComponent = ({ onCustomEvent }: { onCustomEvent: (data: string) => void }) => (
    <TouchableOpacity onPress={() => onCustomEvent('event data')}>
      <Text>Custom</Text>
    </TouchableOpacity>
  );
  const handler = jest.fn();
  await render(<CustomComponent onCustomEvent={handler} />);
  const error = await getErrorMessage(
    fireEvent(screen.getByText('Custom'), 'customEvent', 'event data'),
  );
  // Modern matches React Native, which dispatches only native events, to host elements. Legacy
  // calls any matching prop, also on composite components.
  expect(error).toBe(
    isModern()
      ? `Unable to fire a "customEvent" event. React Native doesn't dispatch "customEvent" natively, so no handler would be called.`
      : undefined,
  );
  expect(handler.mock.calls).toEqual(isModern() ? [] : [['event data']]);
});

test('fireEvent throws for custom prop name (handlePress) on composite component (legacy: calls it)', async () => {
  const MyButton = ({ handlePress }: { handlePress: () => void }) => (
    <TouchableOpacity onPress={handlePress}>
      <Text>Button</Text>
    </TouchableOpacity>
  );
  const handler = jest.fn();
  await render(<MyButton handlePress={handler} />);
  const error = await getErrorMessage(fireEvent(screen.getByText('Button'), 'handlePress'));
  // Modern matches React Native, which dispatches only native events, to host elements. Legacy
  // calls any matching prop, also on composite components.
  expect(error).toBe(
    isModern()
      ? `Unable to fire a "handlePress" event. React Native doesn't dispatch "handlePress" natively, so no handler would be called.`
      : undefined,
  );
  expect(handler).toHaveBeenCalledTimes(isModern() ? 0 : 1);
});

test('fireEvent returns undefined when handler does not return a value', async () => {
  const handler = jest.fn();
  await render(<Pressable testID="btn" onPress={handler} />);
  await expect(fireEvent.press(screen.getByTestId('btn'))).resolves.toBeUndefined();
});

test('fireEvent calls handler on element when both element and parent have handlers', async () => {
  const childHandler = jest.fn();
  const parentHandler = jest.fn();
  await render(
    <TouchableOpacity onPress={parentHandler}>
      <Pressable testID="child" onPress={childHandler}>
        <Text>Press me</Text>
      </Pressable>
    </TouchableOpacity>,
  );
  await fireEvent.press(screen.getByTestId('child'));
  expect(childHandler).toHaveBeenCalledTimes(1);
  expect(parentHandler).not.toHaveBeenCalled();
});

test('fireEvent does nothing when element is unmounted', async () => {
  const onPress = jest.fn();
  await render(
    <View>
      <Pressable testID="btn" onPress={onPress} />
    </View>,
  );
  const element = screen.getByTestId('btn');

  await screen.rerender(<View />);
  await fireEvent.press(element);
  expect(onPress).not.toHaveBeenCalled();
});

test('fireEvent throws with non-existent event name (legacy: does nothing)', async () => {
  await render(<Pressable testID="btn" />);
  const element = screen.getByTestId('btn');
  const error = await getErrorMessage(fireEvent(element, 'nonExistentEvent' as any));
  // React Native never dispatches it, so no handler runs in either. Modern throws to point out
  // the mistake.
  expect(error).toBe(
    isModern()
      ? `Unable to fire a "nonExistentEvent" event. React Native doesn't dispatch "nonExistentEvent" natively, so no handler would be called.`
      : undefined,
  );
});

test('fireEvent handles handler that throws gracefully', async () => {
  const error = new Error('Handler error');
  const onPress = jest.fn(() => {
    throw error;
  });
  await render(<Pressable testID="btn" onPress={onPress} />);
  await expect(fireEvent.press(screen.getByTestId('btn'))).rejects.toThrow('Handler error');
  expect(onPress).toHaveBeenCalledTimes(1);
});

describe('disabled elements', () => {
  test('does not fire on disabled Pressable', async () => {
    const onPress = jest.fn();
    await render(
      <Pressable onPress={onPress} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('does not fire on disabled TouchableOpacity', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableOpacity onPress={onPress} disabled={true}>
        <Text>Trigger</Text>
      </TouchableOpacity>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('bubbles event past disabled inner to enabled outer Pressable', async () => {
    const handleInnerPress = jest.fn();
    const handleOuterPress = jest.fn();
    await render(
      <Pressable onPress={handleOuterPress}>
        <Pressable onPress={handleInnerPress} disabled={true}>
          <Text>Inner Trigger</Text>
        </Pressable>
      </Pressable>,
    );
    await fireEvent.press(screen.getByText('Inner Trigger'));
    expect(handleInnerPress).not.toHaveBeenCalled();
    expect(handleOuterPress).toHaveBeenCalledTimes(1);
  });

  test('bubbles event past disabled inner to enabled outer TouchableOpacity', async () => {
    const handleInnerPress = jest.fn();
    const handleOuterPress = jest.fn();
    await render(
      <TouchableOpacity onPress={handleOuterPress}>
        <TouchableOpacity onPress={handleInnerPress} disabled={true}>
          <Text>Inner Trigger</Text>
        </TouchableOpacity>
      </TouchableOpacity>,
    );
    await fireEvent.press(screen.getByText('Inner Trigger'));
    expect(handleInnerPress).not.toHaveBeenCalled();
    expect(handleOuterPress).toHaveBeenCalledTimes(1);
  });

  test('ignores custom disabled prop on composite component (only respects native disabled)', async () => {
    const TestComponent = ({ onPress }: { onPress: () => void; disabled?: boolean }) => (
      <TouchableOpacity onPress={onPress}>
        <Text>Trigger Test</Text>
      </TouchableOpacity>
    );
    const handlePress = jest.fn();
    await render(<TestComponent onPress={handlePress} disabled={true} />);
    await fireEvent.press(screen.getByText('Trigger Test'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});

describe('unhandled event warning', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    configure({ eventDiagnostics: true });
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('warns when the handler is on a disabled element', async () => {
    await render(
      <Pressable onPress={jest.fn()} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on a disabled element.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
        >
          <Text>
            Trigger
          </Text>
        </View>"
    `);
  });

  test('lists every disabled element the event skipped', async () => {
    await render(
      <Pressable testID="outer" onPress={jest.fn()} disabled={true}>
        <Pressable testID="inner" onPress={jest.fn()} disabled={true}>
          <Text>Trigger</Text>
        </Pressable>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on disabled elements.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="inner"
        >
          <Text>
            Trigger
          </Text>
        </View>

        <View
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="outer"
        >
          <View
            accessibilityState={
              {
                "disabled": true,
              }
            }
            accessible={true}
            testID="inner"
          >
            <Text>
              Trigger
            </Text>
          </View>
        </View>"
    `);
  });

  test('warns when no element handles the event', async () => {
    await render(
      <View>
        <Text>Trigger</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Trigger'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onPress" handler found on the element or its ancestors.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <Text>
          Trigger
        </Text>"
    `);
  });

  test('does not warn when the event bubbles to an enabled parent', async () => {
    await render(
      <Pressable onPress={jest.fn()}>
        <Pressable onPress={jest.fn()} disabled={true}>
          <Text>Inner Trigger</Text>
        </Pressable>
      </Pressable>,
    );

    await fireEvent.press(screen.getByText('Inner Trigger'));

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when the handler is blocked by pointerEvents="none" on an ancestor', async () => {
    await render(
      <View testID="overlay" pointerEvents="none">
        <Pressable testID="btn" onPress={jest.fn()} />
      </View>,
    );

    await fireEvent.press(screen.getByTestId('btn'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
          testID="btn"
        />

      Blocked by:

        <View
          pointerEvents="none"
          testID="overlay"
        />"
    `);
  });

  test('warns when multiple handlers are blocked by pointerEvents="none" on an ancestor', async () => {
    await render(
      <View testID="overlay" pointerEvents="none">
        <Pressable testID="outer" onPress={jest.fn()}>
          <Pressable testID="inner" onPress={jest.fn()} />
        </Pressable>
      </View>,
    );

    await fireEvent.press(screen.getByTestId('inner'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on elements blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
          testID="inner"
        />

        <View
          accessible={true}
          testID="outer"
        >
          <View
            accessible={true}
            testID="inner"
          />
        </View>

      Blocked by:

        <View
          pointerEvents="none"
          testID="overlay"
        />"
    `);
  });

  test('reports pointerEvents rather than disabled when both block the handler', async () => {
    await render(
      <View testID="overlay" pointerEvents="none">
        <Pressable testID="btn" onPress={jest.fn()} disabled={true} />
      </View>,
    );

    await fireEvent.press(screen.getByTestId('btn'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessibilityState={
            {
              "disabled": true,
            }
          }
          accessible={true}
          testID="btn"
        />

      Blocked by:

        <View
          pointerEvents="none"
          testID="overlay"
        />"
    `);
  });

  test('reports the element that blocks with pointerEvents', async () => {
    await render(
      <View testID="box-only" pointerEvents="box-only">
        <View>
          <Pressable testID="inside-box-only" onPress={jest.fn()} />
        </View>
        <Pressable testID="box-none" pointerEvents="box-none" onPress={jest.fn()} />
      </View>,
    );

    await fireEvent.press(screen.getByTestId('inside-box-only'));
    await fireEvent.press(screen.getByTestId('box-none'));

    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
          testID="inside-box-only"
        />

      Blocked by:

        <View
          pointerEvents="box-only"
          testID="box-only"
        />"
    `);
    expect(warnSpy.mock.calls[1][0]).toMatchInlineSnapshot(`
      "Cannot fire the "press" event on an element blocked by pointerEvents.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          accessible={true}
          pointerEvents="box-none"
          testID="box-none"
        />

      Blocked by:

        <View
          accessible={true}
          pointerEvents="box-none"
          testID="box-none"
        />"
    `);
  });

  test('reports non-editable TextInput for events not affected by pointerEvents', async () => {
    await render(
      <View pointerEvents="none">
        <TextInput testID="input" editable={false} onChangeText={jest.fn()} />
      </View>,
    );

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(
      /^Cannot fire the "changeText" event on a non-editable TextInput\./,
    );
  });

  test('does not warn when the responder declines the touch', async () => {
    const onPress = jest.fn();
    // @ts-expect-error Host View does not declare `onPress`.
    await render(<View testID="view" onStartShouldSetResponder={() => false} onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('view'));

    expect(onPress).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('warns when the handler is blocked by non-editable TextInput', async () => {
    await render(<TextInput testID="input" editable={false} onChangeText={jest.fn()} />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "changeText" event on a non-editable TextInput.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <TextInput
          editable={false}
          testID="input"
        />"
    `);
  });

  test('warns when "press" is blocked by non-editable TextInput', async () => {
    await render(<TextInput testID="input" editable={false} onPress={jest.fn()} />);

    await fireEvent(screen.getByTestId('input'), 'press', emptyEvent);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(
      /^Cannot fire the "press" event on a non-editable TextInput\./,
    );
  });

  test.each([
    ['focus', 'onFocus'],
    ['blur', 'onBlur'],
  ])(
    'does not warn when "%s" is fired on non-editable TextInput (legacy: warns it is blocked)',
    async (eventType, handlerName) => {
      const handler = jest.fn();
      await render(<TextInput testID="input" editable={false} {...{ [handlerName]: handler }} />);

      await fireEvent(screen.getByTestId('input'), eventType, emptyEvent);

      // Legacy matches a device, where a non-editable TextInput can't be focused. Modern
      // `fireEvent()` dispatches the event as given, without checking `editable`.
      expect(handler).toHaveBeenCalledTimes(isModern() ? 1 : 0);
      expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
      if (isModern()) return;
      expect(warnSpy.mock.calls[0][0]).toMatch(
        new RegExp(`^Cannot fire the "${eventType}" event on a non-editable TextInput\\.`),
      );
    },
  );

  test('names the non-editable TextInput when the handler is on its parent', async () => {
    const onFocus = jest.fn();
    await render(
      // Spread because `View` types include `onFocus` only since RN 0.88.
      <View testID="parent" {...{ onFocus }}>
        <TextInput testID="input" editable={false} />
      </View>,
    );

    await fireEvent(screen.getByTestId('input'), 'focus', emptyEvent);

    // Legacy matches a device, where a non-editable TextInput can't be focused. Modern
    // `fireEvent()` dispatches the event as given, without checking `editable`.
    expect(onFocus).toHaveBeenCalledTimes(isModern() ? 1 : 0);
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 1);
    if (isModern()) return;
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "Cannot fire the "focus" event on a non-editable TextInput.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <TextInput
          editable={false}
          testID="input"
        />"
    `);
  });

  test('reports disabled elements when they include a non-editable TextInput', async () => {
    await render(
      <Pressable onPress={jest.fn()} disabled={true}>
        <TextInput testID="input" editable={false} onPress={jest.fn()} />
      </Pressable>,
    );

    await fireEvent.press(screen.getByTestId('input'));

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(
      /^Cannot fire the "press" event on disabled elements\./,
    );
  });

  test('warns when element has no onLayout handler and layout event has no layout', async () => {
    await render(<View testID="view" />);

    await fireEvent(screen.getByTestId('view'), 'layout', { nativeEvent: {} });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    // Modern matches React Native: layout is a direct event, so ancestors aren't checked.
    expect(warnSpy.mock.calls[0][0].split('\n')[0]).toBe(
      isModern()
        ? 'No "onLayout" handler found on the element.'
        : 'No "onLayout" handler found on the element or its ancestors.',
    );
    if (isModern()) return;
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "No "onLayout" handler found on the element or its ancestors.
      If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

        <View
          testID="view"
        />"
    `);
  });

  test('does not warn when the event updates native state (uncontrolled TextInput)', async () => {
    await render(<TextInput testID="input" />);

    await fireEvent.changeText(screen.getByTestId('input'), 'Hello');

    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when eventDiagnostics is turned off', async () => {
    configure({ eventDiagnostics: false });
    await render(
      <View>
        <Pressable onPress={jest.fn()} disabled={true}>
          <Text>Disabled</Text>
        </Pressable>
        <Text>No handler</Text>
      </View>,
    );

    await fireEvent.press(screen.getByText('Disabled'));
    await fireEvent.press(screen.getByText('No handler'));
    await fireEvent.layout(screen.getByText('No handler'));

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('pointerEvents prop', () => {
  test('does not fire inside View with pointerEvents="none"', async () => {
    const onPress = jest.fn();
    await render(
      <View pointerEvents="none">
        <Pressable testID="btn" onPress={onPress} />
      </View>,
    );
    await fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('does not fire inside View with pointerEvents="box-only"', async () => {
    const onPress = jest.fn();
    await render(
      <View pointerEvents="box-only">
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('fires inside View with pointerEvents="box-none"', async () => {
    const onPress = jest.fn();
    await render(
      <View pointerEvents="box-none">
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('fires inside View with pointerEvents="auto"', async () => {
    const onPress = jest.fn();
    await render(
      <View pointerEvents="auto">
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not fire deeply inside View with pointerEvents="box-only"', async () => {
    const onPress = jest.fn();
    await render(
      <View pointerEvents="box-only">
        <View>
          <Pressable onPress={onPress}>
            <Text>Trigger</Text>
          </Pressable>
        </View>
      </View>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('fires non-pointer events inside View with pointerEvents="box-none"', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" pointerEvents="box-none" onLayout={onLayout} />);
    await fireEvent(screen.getByTestId('view'), 'layout', layoutEvent);
    expect(onLayout).toHaveBeenCalled();
  });

  test('fires on Pressable with pointerEvents="box-only" on itself', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="pressable" pointerEvents="box-only" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('pressable'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('non-editable TextInput', () => {
  function WrappedTextInput(props: TextInputProps) {
    return <TextInput {...props} />;
  }

  function DoubleWrappedTextInput(props: TextInputProps) {
    return <WrappedTextInput {...props} />;
  }

  test('dispatches focus and submitEditing, but not changeText (legacy: blocks touch-related events)', async () => {
    const onFocus = jest.fn();
    const onChangeText = jest.fn();
    const onSubmitEditing = jest.fn();
    const onLayout = jest.fn();

    await render(
      <TextInput
        editable={false}
        testID="input"
        onFocus={onFocus}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onLayout={onLayout}
      />,
    );

    const input = screen.getByTestId('input');
    await fireEvent(input, 'focus', emptyEvent);
    await fireEvent.changeText(input, 'Text');
    await fireEvent(input, 'submitEditing', { nativeEvent: { text: 'Text' } });
    await fireEvent(input, 'layout', layoutEvent);

    // Legacy matches a device, where a non-editable TextInput can't be focused or submitted.
    // Modern `fireEvent()` dispatches the event as given, without checking `editable`.
    expect(onFocus).toHaveBeenCalledTimes(isModern() ? 1 : 0);
    expect(onChangeText).not.toHaveBeenCalled();
    expect(onSubmitEditing).toHaveBeenCalledTimes(isModern() ? 1 : 0);
    expect(onLayout.mock.calls[0][0]).toMatchObject(layoutEvent);
  });

  test('bubbles focus and submitEditing from nested Text child, but not layout (legacy: blocks touch-related events)', async () => {
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    const onFocus = jest.fn();
    const onChangeText = jest.fn();
    const onSubmitEditing = jest.fn();
    const onLayout = jest.fn();

    await render(
      <TextInput
        editable={false}
        testID="input"
        onFocus={onFocus}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onLayout={onLayout}
      >
        <Text>Nested Text</Text>
      </TextInput>,
    );

    const subject = screen.getByText('Nested Text');
    await fireEvent(subject, 'focus', emptyEvent);
    await fireEvent(subject, 'onFocus', emptyEvent);
    const changeTextError = await getErrorMessage(fireEvent.changeText(subject, 'Text'));
    await fireEvent(subject, 'submitEditing', {
      nativeEvent: { text: 'Text' },
    });
    await fireEvent(subject, 'onSubmitEditing', {
      nativeEvent: { text: 'Text' },
    });
    await fireEvent(subject, 'layout', layoutEvent);
    await fireEvent(subject, 'onLayout', layoutEvent);

    // Legacy matches a device, where a non-editable TextInput can't be focused or submitted.
    // Modern `fireEvent()` dispatches the events as given, and they bubble from the Text to the
    // TextInput.
    expect(onFocus).toHaveBeenCalledTimes(isModern() ? 2 : 0);
    expect(onSubmitEditing).toHaveBeenCalledTimes(isModern() ? 2 : 0);
    // Modern `changeText` accepts only a host TextInput. Legacy walks up to it, and skips it.
    expect(changeTextError).toBe(
      isModern()
        ? 'Unable to fire a "changeText" event. Expected a host "TextInput" element, received "Text".'
        : undefined,
    );
    expect(onChangeText).not.toHaveBeenCalled();
    // Modern matches React Native: layout is a direct event, so it doesn't reach the parent
    // TextInput. Legacy still bubbles it, with a warning.
    expect(onLayout.mock.calls).toEqual(isModern() ? [] : [[layoutEvent], [layoutEvent]]);
    expect(warnSpy).toHaveBeenCalledTimes(isModern() ? 0 : 2);
    warnSpy.mockRestore();
  });

  test.each([
    ['WrappedTextInput', WrappedTextInput],
    ['DoubleWrappedTextInput', DoubleWrappedTextInput],
  ])(
    'dispatches focus and submitEditing on %s, but not changeText (legacy: blocks touch-related events)',
    async (_, Component) => {
      const onFocus = jest.fn();
      const onChangeText = jest.fn();
      const onSubmitEditing = jest.fn();
      const onLayout = jest.fn();

      await render(
        <Component
          editable={false}
          testID="input"
          onFocus={onFocus}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onLayout={onLayout}
        />,
      );

      const input = screen.getByTestId('input');
      await fireEvent(input, 'focus', emptyEvent);
      await fireEvent.changeText(input, 'Text');
      await fireEvent(input, 'submitEditing', { nativeEvent: { text: 'Text' } });
      await fireEvent(input, 'layout', layoutEvent);

      // Legacy matches a device, where a non-editable TextInput can't be focused or submitted.
      // Modern `fireEvent()` dispatches the event as given, without checking `editable`.
      expect(onFocus).toHaveBeenCalledTimes(isModern() ? 1 : 0);
      expect(onChangeText).not.toHaveBeenCalled();
      expect(onSubmitEditing).toHaveBeenCalledTimes(isModern() ? 1 : 0);
      expect(onLayout.mock.calls[0][0]).toMatchObject(layoutEvent);
    },
  );

  test('fires layout event', async () => {
    const onLayout = jest.fn();
    await render(<TextInput testID="input" editable={false} onLayout={onLayout} />);
    await fireEvent(screen.getByTestId('input'), 'layout', layoutEvent);
    expect(onLayout).toHaveBeenCalled();
  });

  test('fires scroll event', async () => {
    const onScroll = jest.fn();
    await render(<TextInput testID="input" editable={false} onScroll={onScroll} />);
    await fireEvent(screen.getByTestId('input'), 'scroll', verticalScrollEvent);
    expect(onScroll).toHaveBeenCalled();
  });
});

describe('responder system', () => {
  test('respects disabled prop through composite wrappers', async () => {
    function TestChildTouchableComponent({
      onPress,
      someProp,
    }: {
      onPress: () => void;
      someProp: boolean;
    }) {
      return (
        <View>
          <TouchableOpacity onPress={onPress} disabled={someProp}>
            <Text>Trigger</Text>
          </TouchableOpacity>
        </View>
      );
    }
    const handlePress = jest.fn();
    await render(
      <View>
        <TestChildTouchableComponent onPress={handlePress} someProp={true} />
      </View>,
    );
    await fireEvent.press(screen.getByText('Trigger'));
    expect(handlePress).not.toHaveBeenCalled();
  });

  test('throws for responderMove on PanResponder component (legacy: calls the handler)', async () => {
    const onDrag = jest.fn();
    function TestDraggableComponent({ onDrag }: { onDrag: () => void }) {
      const responderHandlers = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: onDrag,
      }).panHandlers;
      return (
        <View {...responderHandlers}>
          <Text>Trigger</Text>
        </View>
      );
    }
    await render(<TestDraggableComponent onDrag={onDrag} />);
    const error = await getErrorMessage(
      fireEvent(screen.getByText('Trigger'), 'responderMove', {
        touchHistory: { mostRecentTimeStamp: '2', touchBank: [] },
      }),
    );
    // Legacy calls `onResponderMove` directly. On a device, it follows a granted touch with the
    // responder system's touch history, which modern doesn't simulate, so modern throws.
    expect(error).toBe(
      isModern()
        ? `Unable to fire a "responderMove" event. React Native doesn't dispatch "responderMove" natively, so no handler would be called.`
        : undefined,
    );
    expect(onDrag).toHaveBeenCalledTimes(isModern() ? 0 : 1);
  });
});
