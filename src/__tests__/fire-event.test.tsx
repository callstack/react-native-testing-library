import * as React from 'react';
import {
  PanResponder,
  Platform,
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
  const eventData = { nativeEvent: { pageX: 20, pageY: 30 } };
  await render(<Pressable testID="btn" onPress={onPress} />);
  await fireEvent.press(screen.getByTestId('btn'), eventData);
  expect(onPress).toHaveBeenCalledWith(eventData);
});

test('fireEvent passes multiple parameters to handler', async () => {
  const handlePress = jest.fn();
  await render(<Pressable testID="btn" onPress={handlePress} />);
  await fireEvent(screen.getByTestId('btn'), 'press', 'param1', 'param2');
  expect(handlePress).toHaveBeenCalledWith('param1', 'param2');
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

test('fireEvent returns handler return value', async () => {
  const handler = jest.fn().mockReturnValue('result');
  await render(<Pressable testID="btn" onPress={handler} />);
  const result = await fireEvent.press(screen.getByTestId('btn'));
  expect(result).toBe('result');
});

test('fireEvent does nothing when element is unmounted', async () => {
  const onPress = jest.fn();
  const { unmount } = await render(<Pressable testID="btn" onPress={onPress} />);
  const element = screen.getByTestId('btn');

  await unmount();

  await fireEvent.press(element);
  expect(onPress).not.toHaveBeenCalled();
});

test('fireEvent fires custom event on composite component', async () => {
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

test('fireEvent fires event with custom prop name on composite component', async () => {
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

describe('fireEvent.press', () => {
  test('works on Pressable', async () => {
    const onPress = jest.fn();
    await render(<Pressable testID="pressable" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('pressable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableOpacity', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableOpacity testID="touchable" onPress={onPress}>
        <Text>Press me</Text>
      </TouchableOpacity>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableHighlight', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableHighlight testID="touchable" onPress={onPress}>
        <Text>Press me</Text>
      </TouchableHighlight>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableWithoutFeedback', async () => {
    const onPress = jest.fn();
    await render(
      <TouchableWithoutFeedback testID="touchable" onPress={onPress}>
        <View>
          <Text>Press me</Text>
        </View>
      </TouchableWithoutFeedback>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
    expect(onPress).toHaveBeenCalled();
  });

  test('works on TouchableNativeFeedback', async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    const onPress = jest.fn();
    await render(
      <TouchableNativeFeedback testID="touchable" onPress={onPress}>
        <View>
          <Text>Press me</Text>
        </View>
      </TouchableNativeFeedback>,
    );
    await fireEvent.press(screen.getByTestId('touchable'));
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

  test('updates native state for uncontrolled TextInput', async () => {
    await render(<TextInput testID="input" />);
    const input = screen.getByTestId('input');
    await fireEvent.changeText(input, 'hello');
    expect(input).toHaveDisplayValue('hello');
    expect(nativeState.valueForElement.get(input)).toBe('hello');
  });
});

describe('fireEvent.scroll', () => {
  test('works on ScrollView', async () => {
    const onScroll = jest.fn();
    const eventData = { nativeEvent: { contentOffset: { y: 200 } } };
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, eventData);
    expect(onScroll).toHaveBeenCalledWith(eventData);
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 200 });
  });

  test('fires onScrollBeginDrag', async () => {
    const onScrollBeginDrag = jest.fn();
    const eventData = { nativeEvent: { contentOffset: { x: 50, y: 100 } } };
    await render(<ScrollView testID="scroll" onScrollBeginDrag={onScrollBeginDrag} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'scrollBeginDrag', eventData);
    expect(onScrollBeginDrag).toHaveBeenCalledWith(eventData);
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 50, y: 100 });
  });

  test('fires onScrollEndDrag', async () => {
    const onScrollEndDrag = jest.fn();
    const eventData = { nativeEvent: { contentOffset: { x: 75, y: 150 } } };
    await render(<ScrollView testID="scroll" onScrollEndDrag={onScrollEndDrag} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'scrollEndDrag', eventData);
    expect(onScrollEndDrag).toHaveBeenCalledWith(eventData);
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 75, y: 150 });
  });

  test('fires onMomentumScrollBegin', async () => {
    const onMomentumScrollBegin = jest.fn();
    const eventData = { nativeEvent: { contentOffset: { x: 120, y: 250 } } };
    await render(<ScrollView testID="scroll" onMomentumScrollBegin={onMomentumScrollBegin} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'momentumScrollBegin', eventData);
    expect(onMomentumScrollBegin).toHaveBeenCalledWith(eventData);
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 120, y: 250 });
  });

  test('fires onMomentumScrollEnd', async () => {
    const onMomentumScrollEnd = jest.fn();
    const eventData = { nativeEvent: { contentOffset: { x: 200, y: 400 } } };
    await render(<ScrollView testID="scroll" onMomentumScrollEnd={onMomentumScrollEnd} />);
    const scrollView = screen.getByTestId('scroll');
    await fireEvent(scrollView, 'momentumScrollEnd', eventData);
    expect(onMomentumScrollEnd).toHaveBeenCalledWith(eventData);
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 200, y: 400 });
  });

  test('without contentOffset does not update native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {});
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toBeUndefined();
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
      nativeEvent: { contentOffset: { x: Infinity, y: NaN } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 0, y: 0 });
  });

  test('with valid contentOffset updates native state', async () => {
    const onScroll = jest.fn();
    await render(
      <ScrollView testID="scroll" onScroll={onScroll}>
        <Text>Content</Text>
      </ScrollView>,
    );
    const scrollView = screen.getByTestId('scroll');
    await fireEvent.scroll(scrollView, {
      nativeEvent: { contentOffset: { x: 100, y: 200 } },
    });
    expect(onScroll).toHaveBeenCalled();
    expect(nativeState.contentOffsetForElement.get(scrollView)).toEqual({ x: 100, y: 200 });
  });
});

describe('disabled elements', () => {
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

  test('is not fooled by non-native disabled prop on composite component', async () => {
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
    const onTouchStart = jest.fn();
    await render(<View testID="view" pointerEvents="box-none" onTouchStart={onTouchStart} />);
    await fireEvent(screen.getByTestId('view'), 'touchStart');
    expect(onTouchStart).toHaveBeenCalled();
  });

  test('fires layout event inside View with pointerEvents="box-none"', async () => {
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
  test('does not fire when onStartShouldSetResponder returns false', async () => {
    const onPress = jest.fn();
    await render(
      <View onStartShouldSetResponder={() => false} onPress={onPress}>
        <Text testID="text">Press</Text>
      </View>,
    );
    await fireEvent.press(screen.getByTestId('text'));
    expect(onPress).not.toHaveBeenCalled();
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
