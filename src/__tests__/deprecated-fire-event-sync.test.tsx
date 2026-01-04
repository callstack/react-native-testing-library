import * as React from 'react';
import {
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { deprecated_fireEventSync, render, screen } from '..';

type OnPressComponentProps = {
  onPress: () => void;
  text: string;
};
const OnPressComponent = ({ onPress, text }: OnPressComponentProps) => (
  <View>
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  </View>
);

type CustomEventComponentProps = {
  onCustomEvent: () => void;
};
const CustomEventComponent = ({ onCustomEvent }: CustomEventComponentProps) => (
  <TouchableOpacity onPress={onCustomEvent}>
    <Text>Custom event component</Text>
  </TouchableOpacity>
);

type MyCustomButtonProps = {
  handlePress: () => void;
  text: string;
};
const MyCustomButton = ({ handlePress, text }: MyCustomButtonProps) => (
  <OnPressComponent onPress={handlePress} text={text} />
);

type CustomEventComponentWithCustomNameProps = {
  handlePress: () => void;
};
const CustomEventComponentWithCustomName = ({
  handlePress,
}: CustomEventComponentWithCustomNameProps) => (
  <MyCustomButton handlePress={handlePress} text="Custom component" />
);

describe('deprecated_fireEventSync', () => {
  test('should invoke specified event', () => {
    const onPressMock = jest.fn();
    render(<OnPressComponent onPress={onPressMock} text="Press me" />);

    deprecated_fireEventSync(screen.getByText('Press me'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke specified event on parent element', () => {
    const onPressMock = jest.fn();
    const text = 'New press text';
    render(<OnPressComponent onPress={onPressMock} text={text} />);

    deprecated_fireEventSync(screen.getByText(text), 'press');
    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke event with custom name', () => {
    const handlerMock = jest.fn();
    const EVENT_DATA = 'event data';

    render(
      <View>
        <CustomEventComponent onCustomEvent={handlerMock} />
      </View>,
    );

    deprecated_fireEventSync(screen.getByText('Custom event component'), 'customEvent', EVENT_DATA);

    expect(handlerMock).toHaveBeenCalledWith(EVENT_DATA);
  });
});

test('deprecated_fireEventSync.press', () => {
  const onPressMock = jest.fn();
  const text = 'Fireevent press';
  const eventData = {
    nativeEvent: {
      pageX: 20,
      pageY: 30,
    },
  };
  render(<OnPressComponent onPress={onPressMock} text={text} />);

  deprecated_fireEventSync.press(screen.getByText(text), eventData);

  expect(onPressMock).toHaveBeenCalledWith(eventData);
});

test('deprecated_fireEventSync.scroll', () => {
  const onScrollMock = jest.fn();
  const eventData = {
    nativeEvent: {
      contentOffset: {
        y: 200,
      },
    },
  };

  render(
    <ScrollView onScroll={onScrollMock}>
      <Text>XD</Text>
    </ScrollView>,
  );

  deprecated_fireEventSync.scroll(screen.getByText('XD'), eventData);

  expect(onScrollMock).toHaveBeenCalledWith(eventData);
});

test('deprecated_fireEventSync.changeText', () => {
  const onChangeTextMock = jest.fn();

  render(
    <View>
      <TextInput placeholder="Customer placeholder" onChangeText={onChangeTextMock} />
    </View>,
  );

  const input = screen.getByPlaceholderText('Customer placeholder');
  deprecated_fireEventSync.changeText(input, 'content');
  expect(onChangeTextMock).toHaveBeenCalledWith('content');
});

it('sets native state value for unmanaged text inputs', () => {
  render(<TextInput testID="input" />);

  const input = screen.getByTestId('input');
  expect(input).toHaveDisplayValue('');

  deprecated_fireEventSync.changeText(input, 'abc');
  expect(input).toHaveDisplayValue('abc');
});

test('custom component with custom event name', () => {
  const handlePress = jest.fn();

  render(<CustomEventComponentWithCustomName handlePress={handlePress} />);

  deprecated_fireEventSync(screen.getByText('Custom component'), 'handlePress');

  expect(handlePress).toHaveBeenCalled();
});

test('event with multiple handler parameters', () => {
  const handlePress = jest.fn();

  render(<CustomEventComponentWithCustomName handlePress={handlePress} />);

  deprecated_fireEventSync(screen.getByText('Custom component'), 'handlePress', 'param1', 'param2');

  expect(handlePress).toHaveBeenCalledWith('param1', 'param2');
});

test('should not fire on disabled TouchableOpacity', () => {
  const handlePress = jest.fn();
  render(
    <View>
      <TouchableOpacity onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </TouchableOpacity>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire on disabled Pressable', () => {
  const handlePress = jest.fn();
  render(
    <View>
      <Pressable onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="none" in props', () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="none" in styles', () => {
  const onPress = jest.fn();
  render(
    <View style={{ pointerEvents: 'none' }}>
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="none" in styles array', () => {
  const onPress = jest.fn();
  render(
    <View style={[{ pointerEvents: 'none' }]}>
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="box-only" in props', () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-only">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="box-only" in styles', () => {
  const onPress = jest.fn();
  render(
    <View style={{ pointerEvents: 'box-only' }}>
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire inside View with pointerEvents="box-none" in props', () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should fire inside View with pointerEvents="box-none" in styles', () => {
  const onPress = jest.fn();
  render(
    <View style={{ pointerEvents: 'box-none' }}>
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should fire inside View with pointerEvents="auto" in props', () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="auto">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should fire inside View with pointerEvents="auto" in styles', () => {
  const onPress = jest.fn();
  render(
    <View style={{ pointerEvents: 'auto' }}>
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should not fire deeply inside View with pointerEvents="box-only" in props', () => {
  const onPress = jest.fn();
  render(
    <View pointerEvents="box-only">
      <View>
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire deeply inside View with pointerEvents="box-only" in styles', () => {
  const onPress = jest.fn();
  render(
    <View style={{ pointerEvents: 'box-only' }}>
      <View>
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  deprecated_fireEventSync(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire non-pointer events inside View with pointerEvents="box-none" in props', () => {
  const onTouchStart = jest.fn();
  render(<View testID="view" pointerEvents="box-none" onTouchStart={onTouchStart} />);

  deprecated_fireEventSync(screen.getByTestId('view'), 'touchStart');
  expect(onTouchStart).toHaveBeenCalled();
});

test('should fire non-pointer events inside View with pointerEvents="box-none" in styles', () => {
  const onTouchStart = jest.fn();
  render(<View testID="view" style={{ pointerEvents: 'box-none' }} onTouchStart={onTouchStart} />);

  deprecated_fireEventSync(screen.getByTestId('view'), 'touchStart');
  expect(onTouchStart).toHaveBeenCalled();
});

test('should fire non-touch events inside View with pointerEvents="box-none" in props', () => {
  const onLayout = jest.fn();
  render(<View testID="view" pointerEvents="box-none" onLayout={onLayout} />);

  deprecated_fireEventSync(screen.getByTestId('view'), 'layout');
  expect(onLayout).toHaveBeenCalled();
});

test('should fire non-touch events inside View with pointerEvents="box-none" in styles', () => {
  const onLayout = jest.fn();
  render(<View testID="view" style={{ pointerEvents: 'box-none' }} onLayout={onLayout} />);

  deprecated_fireEventSync(screen.getByTestId('view'), 'layout');
  expect(onLayout).toHaveBeenCalled();
});

// This test if pointerEvents="box-only" on composite `Pressable` is blocking
// the 'press' event on host View rendered by pressable.
test('should fire on Pressable with pointerEvents="box-only" in props', () => {
  const onPress = jest.fn();
  render(<Pressable testID="pressable" pointerEvents="box-only" onPress={onPress} />);

  deprecated_fireEventSync.press(screen.getByTestId('pressable'));
  expect(onPress).toHaveBeenCalled();
});

test('should fire on Pressable with pointerEvents="box-only" in styles', () => {
  const onPress = jest.fn();
  render(<Pressable testID="pressable" style={{ pointerEvents: 'box-only' }} onPress={onPress} />);

  deprecated_fireEventSync.press(screen.getByTestId('pressable'));
  expect(onPress).toHaveBeenCalled();
});

test('should pass event up on disabled TouchableOpacity', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  render(
    <TouchableOpacity onPress={handleOuterPress}>
      <TouchableOpacity onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </TouchableOpacity>
    </TouchableOpacity>,
  );

  deprecated_fireEventSync.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

test('should pass event up on disabled Pressable', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  render(
    <Pressable onPress={handleOuterPress}>
      <Pressable onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </Pressable>
    </Pressable>,
  );

  deprecated_fireEventSync.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

type TestComponentProps = {
  onPress: () => void;
  disabled?: boolean;
};
const TestComponent = ({ onPress }: TestComponentProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Trigger Test</Text>
    </TouchableOpacity>
  );
};

test('is not fooled by non-native disabled prop', () => {
  const handlePress = jest.fn();
  render(<TestComponent onPress={handlePress} disabled={true} />);

  deprecated_fireEventSync.press(screen.getByText('Trigger Test'));
  expect(handlePress).toHaveBeenCalledTimes(1);
});

type TestChildTouchableComponentProps = {
  onPress: () => void;
  someProp: boolean;
};

function TestChildTouchableComponent({ onPress, someProp }: TestChildTouchableComponentProps) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} disabled={someProp}>
        <Text>Trigger</Text>
      </TouchableOpacity>
    </View>
  );
}

test('is not fooled by non-responder wrapping host elements', () => {
  const handlePress = jest.fn();

  render(
    <View>
      <TestChildTouchableComponent onPress={handlePress} someProp={true} />
    </View>,
  );

  deprecated_fireEventSync.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

type TestDraggableComponentProps = { onDrag: () => void };

function TestDraggableComponent({ onDrag }: TestDraggableComponentProps) {
  const responderHandlers = PanResponder.create({
    onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
    onPanResponderMove: onDrag,
  }).panHandlers;

  return (
    <View {...responderHandlers}>
      <Text>Trigger</Text>
    </View>
  );
}

test('has only onMove', () => {
  const handleDrag = jest.fn();

  render(<TestDraggableComponent onDrag={handleDrag} />);

  deprecated_fireEventSync(screen.getByText('Trigger'), 'responderMove', {
    touchHistory: { mostRecentTimeStamp: '2', touchBank: [] },
  });
  expect(handleDrag).toHaveBeenCalled();
});

// Those events ideally should be triggered through `deprecated_fireEventSync.scroll`, but they are handled at the
// native level, so we need to support manually triggering them
describe('native events', () => {
  test('triggers onScrollBeginDrag', () => {
    const onScrollBeginDragSpy = jest.fn();
    render(<ScrollView testID="test-id" onScrollBeginDrag={onScrollBeginDragSpy} />);

    deprecated_fireEventSync(screen.getByTestId('test-id'), 'onScrollBeginDrag');
    expect(onScrollBeginDragSpy).toHaveBeenCalled();
  });

  test('triggers onScrollEndDrag', () => {
    const onScrollEndDragSpy = jest.fn();
    render(<ScrollView testID="test-id" onScrollEndDrag={onScrollEndDragSpy} />);

    deprecated_fireEventSync(screen.getByTestId('test-id'), 'onScrollEndDrag');
    expect(onScrollEndDragSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollBegin', () => {
    const onMomentumScrollBeginSpy = jest.fn();
    render(<ScrollView testID="test-id" onMomentumScrollBegin={onMomentumScrollBeginSpy} />);

    deprecated_fireEventSync(screen.getByTestId('test-id'), 'onMomentumScrollBegin');
    expect(onMomentumScrollBeginSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollEnd', () => {
    const onMomentumScrollEndSpy = jest.fn();
    render(<ScrollView testID="test-id" onMomentumScrollEnd={onMomentumScrollEndSpy} />);

    deprecated_fireEventSync(screen.getByTestId('test-id'), 'onMomentumScrollEnd');
    expect(onMomentumScrollEndSpy).toHaveBeenCalled();
  });
});

test('should handle unmounted elements gracefully', () => {
  const onPress = jest.fn();
  render(
    <TouchableOpacity onPress={onPress}>
      <Text>Test</Text>
    </TouchableOpacity>,
  );

  const element = screen.getByText('Test');
  screen.unmount();

  // Firing event on unmounted element should not crash
  deprecated_fireEventSync.press(element);
  expect(onPress).not.toHaveBeenCalled();
});
