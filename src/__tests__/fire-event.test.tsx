import * as React from 'react';
import type { TextInputProps } from 'react-native';
import {
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

import { fireEvent, render, screen } from '..';
import { nativeState } from '../native-state';

const layoutEvent = { nativeEvent: { layout: { width: 100, height: 100 } } };
const verticalScrollEvent = { nativeEvent: { contentOffset: { y: 200 } } };
const horizontalScrollEvent = { nativeEvent: { contentOffset: { x: 50 } } };
const pressEventData = { nativeEvent: { pageX: 20, pageY: 30 } };

test('fireEvent accepts event name with or without "on" prefix', async () => {
  const onPress = jest.fn();
  await render(<Pressable testID="btn" onPress={onPress} />);

  await fireEvent(screen.getByTestId('btn'), 'press');
  expect(onPress).toHaveBeenCalledTimes(1);

  await fireEvent(screen.getByTestId('btn'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
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
});

describe('fireEvent.changeText', () => {
  test('works on TextInput', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    await fireEvent.changeText(input, 'new text');
    expect(onChangeText).toHaveBeenCalledWith('new text');
    expect(nativeState.valueForElement.get(input)).toBe('new text');
  });

  test('does not fire on non-editable TextInput', async () => {
    const onChangeText = jest.fn();
    await render(<TextInput testID="input" editable={false} onChangeText={onChangeText} />);
    const input = screen.getByTestId('input');
    await fireEvent.changeText(input, 'new text');
    expect(onChangeText).not.toHaveBeenCalled();
    expect(nativeState.valueForElement.get(input)).toBeUndefined();
  });
});

describe('fireEvent.scroll', () => {
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 200 });
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 200 });
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 0 });
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 0 });
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 50, y: 0 });
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
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 0 });
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
    await fireEvent(subject, 'submitEditing', { nativeEvent: { text: 'Text' } });
    await fireEvent(subject, 'onSubmitEditing', { nativeEvent: { text: 'Text' } });
    await fireEvent(subject, 'layout', layoutEvent);
    await fireEvent(subject, 'onLayout', layoutEvent);

    expect(onFocus).not.toHaveBeenCalled();
    expect(onChangeText).not.toHaveBeenCalled();
    expect(onSubmitEditing).not.toHaveBeenCalled();
    expect(onLayout).toHaveBeenCalledTimes(2);
    expect(onLayout).toHaveBeenCalledWith(layoutEvent);
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
