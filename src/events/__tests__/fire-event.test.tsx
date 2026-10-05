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

import { fireEvent, render, screen } from '../..';
import { configure } from '../../config';
import { _console, logger } from '../../helpers/logger';
import { getEventHandlerName } from '../handler';
import { nativeState } from '../native-state';

const layoutEvent = { nativeEvent: { layout: { width: 100, height: 100 } } };
const verticalScrollEvent = { nativeEvent: { contentOffset: { y: 200 } } };
const horizontalScrollEvent = { nativeEvent: { contentOffset: { x: 50 } } };
const pressEventData = { nativeEvent: { pageX: 20, pageY: 30 } };

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 100100100100);
});

test('fireEvent accepts event name with or without "on" prefix', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);

  await fireEvent(screen.getByTestId('btn'), 'press');
  expect(onPress).toHaveBeenCalledTimes(1);

  await fireEvent(screen.getByTestId('btn'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('fireEvent with "on" prefixed name does not call unprefixed handler props', async () => {
  const press = jest.fn();
  const testOnlyPress = jest.fn();
  // @ts-expect-error Intentionally passing such props
  await render(<View testID="view" press={press} testOnly_press={testOnlyPress} />);

  await fireEvent(screen.getByTestId('view'), 'onPress');
  expect(press).not.toHaveBeenCalled();
  expect(testOnlyPress).not.toHaveBeenCalled();

  await fireEvent(screen.getByTestId('view'), 'press');
  expect(press).toHaveBeenCalledTimes(1);
});

test('fireEvent passes event data to handler', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);
  await fireEvent.press(screen.getByTestId('btn'), pressEventData);
  expect(onPress.mock.calls[0][0]).toMatchObject(pressEventData);
});

test('fireEvent passes multiple parameters to handler', async () => {
  const handlePress = jest.fn();
  await render(<Pressable testID="btn" onPress={handlePress} />);
  await fireEvent(screen.getByTestId('btn'), 'press', 'param1', 'param2', 'param3');
  expect(handlePress).toHaveBeenCalledWith('param1', 'param2', 'param3');
});

test('fireEvent.press returns undefined when event handler returns a value', async () => {
  const handler = jest.fn().mockReturnValue('result');
  await render(<Pressable testID="btn" onPress={handler} />);
  const result = await fireEvent.press(screen.getByTestId('btn'));
  expect(result).toBe(undefined);
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
  test('passes default press event object to handler', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="btn" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('btn'));
    expect(onPress.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "currentTarget": {
          "measure": [Function],
        },
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": {
          "changedTouches": [],
          "identifier": 0,
          "locationX": 0,
          "locationY": 0,
          "pageX": 0,
          "pageY": 0,
          "target": 0,
          "timestamp": 100100100100,
          "touches": [],
        },
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
    expect(onPress.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "currentTarget": {
          "measure": [Function],
        },
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": {
          "changedTouches": [],
          "identifier": 0,
          "locationX": 0,
          "locationY": 0,
          "pageX": 20,
          "pageY": 30,
          "target": 0,
          "timestamp": 100100100100,
          "touches": [],
        },
        "persist": [Function],
        "preventDefault": [Function],
        "stopPropagation": [Function],
        "target": {},
        "timeStamp": 0,
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

    await fireEvent(subject, 'pressIn');
    expect(onPressIn).toHaveBeenCalledTimes(1);

    await fireEvent(subject, 'pressOut');
    expect(onPressOut).toHaveBeenCalledTimes(1);

    await fireEvent(subject, 'longPress');
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

  test('updates native state when fired with `on*` prefixed name', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    await fireEvent(input, 'onChangeText', 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
    expect(nativeState.valueForInstance.get(input)).toBe('new text');
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

describe('fireEvent.scroll', () => {
  test('passes default scroll event object to handler', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView);
    expect(onScroll.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "currentTarget": {},
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": {
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
        },
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
    expect(onScroll.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "currentTarget": {},
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": {
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
        },
        "persist": [Function],
        "preventDefault": [Function],
        "stopPropagation": [Function],
        "target": {},
        "timeStamp": 0,
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
    expect(onScroll).toHaveBeenCalledWith(verticalScrollEvent);
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
  ])('fires %s on ScrollView', async (propName, eventName) => {
    const handler = jest.fn();
    await render(<ScrollView testID="scroll" {...{ [propName]: handler }} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, eventName, verticalScrollEvent);
    expect(handler).toHaveBeenCalledWith(verticalScrollEvent);
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
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    const onScroll = jest.fn();
    await render(
      <ScrollView onScroll={onScroll}>
        <View testID="content" onLayout={() => {}} />
      </ScrollView>,
    );
    const content = screen.getByTestId('content');

    await fireEvent.layout(content, { width: 390, height: 750 });
    await fireEvent.scroll(content);

    expect(onScroll.mock.calls[0][0].nativeEvent.layoutMeasurement).toEqual({
      width: 0,
      height: 0,
    });
    warnSpy.mockRestore();
  });
});

describe('fireEvent.layout', () => {
  test('passes default layout event object to handler', async () => {
    const onLayout = jest.fn();
    await render(<View testID="view" onLayout={onLayout} />);

    await fireEvent.layout(screen.getByTestId('view'));

    expect(onLayout.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "currentTarget": {},
        "isDefaultPrevented": [Function],
        "isPersistent": [Function],
        "isPropagationStopped": [Function],
        "nativeEvent": {
          "layout": {
            "height": 0,
            "width": 0,
            "x": 0,
            "y": 0,
          },
          "target": 0,
        },
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

  test('bubbles with a warning when fired as generic layout event', async () => {
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    const onLayout = jest.fn();
    await render(
      <View testID="parent" onLayout={onLayout}>
        <View testID="child" />
      </View>,
    );

    await fireEvent(screen.getByTestId('child'), 'layout', layoutEvent);
    await fireEvent(screen.getByTestId('child'), 'onLayout', layoutEvent);

    expect(onLayout).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(2);
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

  test('warns when element has no onLayout handler and event has no layout', async () => {
    configure({ eventDiagnostics: true });
    const warnSpy = jest.spyOn(_console, 'warn').mockImplementation(() => {});
    await render(<View testID="view" />);

    await fireEvent(screen.getByTestId('view'), 'layout', { nativeEvent: {} });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "  ▲ No "onLayout" handler found on the element or its ancestors.
          If this is intentional, you can disable this warning via \`configure({ eventDiagnostics: false })\`.

            <View
              testID="view"
            />
      "
    `);
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

  const directEventCases: Array<{
    name: string;
    eventName: string;
    ui: (handler: jest.Mock) => React.ReactElement;
  }> = [
    {
      name: 'layout from View content',
      eventName: 'layout',
      ui: (handler) => (
        <View testID="emitter" onLayout={handler}>
          <View testID="target" />
        </View>
      ),
    },
    {
      name: 'accessibilityAction from Pressable content',
      eventName: 'accessibilityAction',
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
    {
      name: 'textLayout from nested Text',
      eventName: 'textLayout',
      ui: (handler) => (
        <Text testID="emitter" onTextLayout={handler}>
          <Text testID="target">Nested</Text>
        </Text>
      ),
    },
    ...(['scroll', 'selectionChange', 'contentSizeChange'] as const).map((eventName) => ({
      name: `${eventName} from TextInput content`,
      eventName,
      ui: (handler: jest.Mock) => (
        <TextInput testID="emitter" {...{ [getEventHandlerName(eventName)]: handler }}>
          <Text testID="target">Nested</Text>
        </TextInput>
      ),
    })),
    ...(['loadStart', 'progress', 'load', 'error', 'loadEnd'] as const).map((eventName) => ({
      name: `${eventName} from Image content`,
      eventName,
      // Image does not accept children, clone it to fire the event on a nested element.
      ui: (handler: jest.Mock) =>
        React.cloneElement(
          <Image
            testID="emitter"
            source={{ uri: 'https://example.com/image.png' }}
            {...{ [getEventHandlerName(eventName)]: handler }}
          />,
          {},
          <Text testID="target">Nested</Text>,
        ),
    })),
    ...(
      [
        'scroll',
        'scrollBeginDrag',
        'scrollEndDrag',
        'momentumScrollBegin',
        'momentumScrollEnd',
        'contentSizeChange',
      ] as const
    ).map((eventName) => ({
      name: `${eventName} from ScrollView content`,
      eventName,
      ui: (handler: jest.Mock) => (
        <ScrollView testID="emitter" {...{ [getEventHandlerName(eventName)]: handler }}>
          <View testID="target" />
        </ScrollView>
      ),
    })),
    {
      name: 'scroll from TextInput to ancestor ScrollView',
      eventName: 'scroll',
      ui: (handler) => (
        <ScrollView testID="emitter" onScroll={handler}>
          <TextInput testID="target" />
        </ScrollView>
      ),
    },
    {
      name: 'refresh from FlatList item',
      eventName: 'refresh',
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
      eventName: 'contentSizeChange',
      ui: (handler) => (
        <FlatList
          testID="emitter"
          data={['Item']}
          renderItem={({ item }) => <Text testID="target">{item}</Text>}
          onContentSizeChange={handler}
        />
      ),
    },
    ...(['requestClose', 'show', 'dismiss', 'orientationChange'] as const).map((eventName) => ({
      name: `${eventName} from Modal content`,
      eventName,
      ui: (handler: jest.Mock) => (
        <Modal testID="emitter" visible {...{ [getEventHandlerName(eventName)]: handler }}>
          <Text testID="target">Content</Text>
        </Modal>
      ),
    })),
  ];

  test.each(directEventCases)('bubbles $name with a warning', async ({ eventName, ui }) => {
    const handler = jest.fn();
    await render(ui(handler));

    await fireEvent(screen.getByTestId('target'), eventName);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  test.each(directEventCases)(
    'does not warn for $name when fired on the emitting element',
    async ({ eventName, ui }) => {
      const handler = jest.fn();
      await render(ui(handler));

      await fireEvent(screen.getByTestId('emitter'), eventName);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    },
  );

  test('warns when fired with "on" prefixed event name', async () => {
    const onMomentumScrollEnd = jest.fn();
    await render(
      <ScrollView onMomentumScrollEnd={onMomentumScrollEnd}>
        <View testID="child" />
      </ScrollView>,
    );

    await fireEvent(screen.getByTestId('child'), 'onMomentumScrollEnd');

    expect(onMomentumScrollEnd).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  test('warns about stopping bubbling in the next major version', async () => {
    await render(
      <ScrollView testID="scroll" onScroll={() => {}}>
        <View testID="child" />
      </ScrollView>,
    );

    await fireEvent.scroll(screen.getByTestId('child'));

    expect(warnSpy.mock.calls[0][0]).toMatchInlineSnapshot(`
      "  ▲ fireEvent: "scroll" event bubbled to the handler of an ancestor element. React Native does not bubble this event, and fireEvent will stop bubbling it in the next major version. Fire it on the element that has the handler instead. <RCTScrollView
            testID="scroll"
          />
      "
    `);
  });

  test('warns when handler is on composite component above the emitting element', async () => {
    const onScroll = jest.fn();
    const Screen = (_props: { onScroll: () => void }) => (
      <ScrollView>
        <View testID="child" />
      </ScrollView>
    );
    await render(<Screen onScroll={onScroll} />);

    await fireEvent.scroll(screen.getByTestId('child'));

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  // Known gap: only the type of the element with the handler is checked.
  test('does not warn when handler is on an element that does not emit the event', async () => {
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

    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when bubbling to composite component handler', async () => {
    const onLoad = jest.fn();
    const onShow = jest.fn();
    const Card = (_props: { onLoad: () => void; onShow: () => void }) => (
      <View>
        <Text>Card</Text>
      </View>
    );
    await render(<Card onLoad={onLoad} onShow={onShow} />);

    await fireEvent(screen.getByText('Card'), 'load');
    await fireEvent(screen.getByText('Card'), 'show');

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when bubbling to host element that does not emit the event', async () => {
    const onLoad = jest.fn();
    await render(
      // @ts-expect-error View does not have onLoad prop
      <View onLoad={onLoad}>
        <Text>Content</Text>
      </View>,
    );

    await fireEvent(screen.getByText('Content'), 'load');

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('does not warn when bubbling load event to ImageBackground handler', async () => {
    const onLoad = jest.fn();
    await render(
      <ImageBackground source={{ uri: 'https://example.com/image.png' }} onLoad={onLoad}>
        <Text>Caption</Text>
      </ImageBackground>,
    );

    await fireEvent(screen.getByText('Caption'), 'load');

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

test('fireEvent fires custom event (onCustomEvent) on composite component', async () => {
  const CustomComponent = ({ onCustomEvent }: { onCustomEvent: (data: string) => void }) => (
    <TouchableOpacity onPress={() => onCustomEvent('event data')}>
      <Text>Custom</Text>
    </TouchableOpacity>
  );
  const handler = jest.fn();
  await render(<CustomComponent onCustomEvent={handler} />);
  await fireEvent(screen.getByText('Custom'), 'customEvent', 'event data');
  expect(handler).toHaveBeenCalledWith('event data');
});

test('fireEvent fires event with custom prop name (handlePress) on composite component', async () => {
  const MyButton = ({ handlePress }: { handlePress: () => void }) => (
    <TouchableOpacity onPress={handlePress}>
      <Text>Button</Text>
    </TouchableOpacity>
  );
  const handler = jest.fn();
  await render(<MyButton handlePress={handler} />);
  await fireEvent(screen.getByText('Button'), 'handlePress');
  expect(handler).toHaveBeenCalled();
});

test('fireEvent returns undefined when handler does not return a value', async () => {
  const handler = jest.fn();
  await render(<Pressable testID="btn" onPress={handler} />);
  const result = await fireEvent.press(screen.getByTestId('btn'));
  expect(result).toBeUndefined();
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

test('fireEvent does not throw when called with non-existent event name', async () => {
  await render(<Pressable testID="btn" />);
  const element = screen.getByTestId('btn');
  await expect(fireEvent(element, 'nonExistentEvent' as any)).resolves.toBeUndefined();
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

  test.each([
    ['focus', 'onFocus'],
    ['blur', 'onBlur'],
    ['press', 'onPress'],
  ])('warns when "%s" is blocked by non-editable TextInput', async (eventName, handlerName) => {
    await render(<TextInput testID="input" editable={false} {...{ [handlerName]: jest.fn() }} />);

    await fireEvent(screen.getByTestId('input'), eventName);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(
      new RegExp(`^Cannot fire the "${eventName}" event on a non-editable TextInput\\.`),
    );
  });

  test('names the non-editable TextInput when the handler is on its parent', async () => {
    const onFocus = jest.fn();
    await render(
      // Spread because `View` types include `onFocus` only since RN 0.88.
      <View testID="parent" {...{ onFocus }}>
        <TextInput testID="input" editable={false} />
      </View>,
    );

    await fireEvent(screen.getByTestId('input'), 'focus');

    expect(onFocus).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
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
    await fireEvent(screen.getByTestId('view'), 'layout');
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

  test('blocks touch-related events but allows non-touch events', async () => {
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
    await fireEvent(input, 'focus');
    await fireEvent.changeText(input, 'Text');
    await fireEvent(input, 'submitEditing', { nativeEvent: { text: 'Text' } });
    await fireEvent(input, 'layout', layoutEvent);

    expect(onFocus).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
    expect(onSubmitEditing).not.toHaveBeenCalled();
    expect(onLayout).toHaveBeenCalledWith(layoutEvent);
  });

  test('blocks touch-related events when firing on nested Text child', async () => {
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
    await fireEvent(subject, 'focus');
    await fireEvent(subject, 'onFocus');
    await fireEvent.changeText(subject, 'Text');
    await fireEvent(subject, 'submitEditing', {
      nativeEvent: { text: 'Text' },
    });
    await fireEvent(subject, 'onSubmitEditing', {
      nativeEvent: { text: 'Text' },
    });
    await fireEvent(subject, 'layout', layoutEvent);
    await fireEvent(subject, 'onLayout', layoutEvent);

    expect(onFocus).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
    expect(onSubmitEditing).not.toHaveBeenCalled();
    // Layout is a direct event, but still bubbles to the parent TextInput with a warning
    expect(onLayout).toHaveBeenCalledTimes(2);
    expect(onLayout).toHaveBeenCalledWith(layoutEvent);
    expect(warnSpy).toHaveBeenCalledTimes(2);
    warnSpy.mockRestore();
  });

  test.each([
    ['WrappedTextInput', WrappedTextInput],
    ['DoubleWrappedTextInput', DoubleWrappedTextInput],
  ])('blocks touch-related events on %s', async (_, Component) => {
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
    await fireEvent(input, 'focus');
    await fireEvent.changeText(input, 'Text');
    await fireEvent(input, 'submitEditing', { nativeEvent: { text: 'Text' } });
    await fireEvent(input, 'layout', layoutEvent);

    expect(onFocus).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
    expect(onSubmitEditing).not.toHaveBeenCalled();
    expect(onLayout).toHaveBeenCalledWith(layoutEvent);
  });

  test('fires layout event', async () => {
    const onLayout = jest.fn();
    await render(<TextInput testID="input" editable={false} onLayout={onLayout} />);
    await fireEvent(screen.getByTestId('input'), 'layout');
    expect(onLayout).toHaveBeenCalled();
  });

  test('fires scroll event', async () => {
    const onScroll = jest.fn();
    await render(<TextInput testID="input" editable={false} onScroll={onScroll} />);
    await fireEvent(screen.getByTestId('input'), 'scroll');
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

  test('fires responderMove on PanResponder component', async () => {
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
    await fireEvent(screen.getByText('Trigger'), 'responderMove', {
      touchHistory: { mostRecentTimeStamp: '2', touchBank: [] },
    });
    expect(onDrag).toHaveBeenCalled();
  });
});
