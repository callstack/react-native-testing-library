import * as React from 'react';
import {
  View,
  TouchableOpacity,
  PanResponder,
  Pressable,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { render, fireEvent } from '..';

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

type WithoutEventComponentProps = { onPress: () => void };
const WithoutEventComponent = (_props: WithoutEventComponentProps) => (
  <View>
    <Text>Without event</Text>
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

describe('fireEvent', () => {
  test('should invoke specified event', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <OnPressComponent onPress={onPressMock} text="Press me" />
    );

    fireEvent(getByText('Press me'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke specified event on parent element', () => {
    const onPressMock = jest.fn();
    const text = 'New press text';
    const { getByText } = render(
      <OnPressComponent onPress={onPressMock} text={text} />
    );

    fireEvent(getByText(text), 'press');
    expect(onPressMock).toHaveBeenCalled();
  });

  test('should not fire if the press handler is not passed to children', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      // TODO: this functionality is buggy, i.e. it will fail if we wrap this component with a View.
      <WithoutEventComponent onPress={onPressMock} />
    );
    fireEvent(getByText('Without event'), 'press');
    expect(onPressMock).not.toHaveBeenCalled();
  });

  test('should invoke event with custom name', () => {
    const handlerMock = jest.fn();
    const EVENT_DATA = 'event data';

    const { getByText } = render(
      <View>
        <CustomEventComponent onCustomEvent={handlerMock} />
      </View>
    );

    fireEvent(getByText('Custom event component'), 'customEvent', EVENT_DATA);

    expect(handlerMock).toHaveBeenCalledWith(EVENT_DATA);
  });
});

test('fireEvent.press', () => {
  const onPressMock = jest.fn();
  const text = 'Fireevent press';
  const eventData = {
    nativeEvent: {
      pageX: 20,
      pageY: 30,
    },
  };
  const { getByText } = render(
    <OnPressComponent onPress={onPressMock} text={text} />
  );

  fireEvent.press(getByText(text), eventData);

  expect(onPressMock).toHaveBeenCalledWith(eventData);
});

test('fireEvent.scroll', () => {
  const onScrollMock = jest.fn();
  const eventData = {
    nativeEvent: {
      contentOffset: {
        y: 200,
      },
    },
  };

  const { getByText } = render(
    <ScrollView onScroll={onScrollMock}>
      <Text>XD</Text>
    </ScrollView>
  );

  fireEvent.scroll(getByText('XD'), eventData);

  expect(onScrollMock).toHaveBeenCalledWith(eventData);
});

test('fireEvent.changeText', () => {
  const onChangeTextMock = jest.fn();
  const CHANGE_TEXT = 'content';

  const { getByPlaceholderText } = render(
    <View>
      <TextInput
        placeholder="Customer placeholder"
        onChangeText={onChangeTextMock}
      />
    </View>
  );

  fireEvent.changeText(
    getByPlaceholderText('Customer placeholder'),
    CHANGE_TEXT
  );

  expect(onChangeTextMock).toHaveBeenCalledWith(CHANGE_TEXT);
});

test('custom component with custom event name', () => {
  const handlePress = jest.fn();

  const { getByText } = render(
    <CustomEventComponentWithCustomName handlePress={handlePress} />
  );

  fireEvent(getByText('Custom component'), 'handlePress');

  expect(handlePress).toHaveBeenCalled();
});

test('event with multiple handler parameters', () => {
  const handlePress = jest.fn();

  const { getByText } = render(
    <CustomEventComponentWithCustomName handlePress={handlePress} />
  );

  fireEvent(getByText('Custom component'), 'handlePress', 'param1', 'param2');

  expect(handlePress).toHaveBeenCalledWith('param1', 'param2');
});

test('should not fire on disabled TouchableOpacity', () => {
  const handlePress = jest.fn();
  const screen = render(
    <View>
      <TouchableOpacity onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </TouchableOpacity>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire on disabled Pressable', () => {
  const handlePress = jest.fn();
  const screen = render(
    <View>
      <Pressable onPress={handlePress} disabled={true}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="none"', () => {
  const onPress = jest.fn();
  const screen = render(
    <View pointerEvents="none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  fireEvent(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should not fire inside View with pointerEvents="box-only"', () => {
  const onPress = jest.fn();
  const screen = render(
    <View pointerEvents="box-only">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  fireEvent(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire inside View with pointerEvents="box-none"', () => {
  const onPress = jest.fn();
  const screen = render(
    <View pointerEvents="box-none">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  fireEvent(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should fire inside View with pointerEvents="auto"', () => {
  const onPress = jest.fn();
  const screen = render(
    <View pointerEvents="auto">
      <Pressable onPress={onPress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  fireEvent(screen.getByText('Trigger'), 'onPress');
  expect(onPress).toHaveBeenCalledTimes(2);
});

test('should not fire deeply inside View with pointerEvents="box-only"', () => {
  const onPress = jest.fn();
  const screen = render(
    <View pointerEvents="box-only">
      <View>
        <Pressable onPress={onPress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  fireEvent(screen.getByText('Trigger'), 'onPress');
  expect(onPress).not.toHaveBeenCalled();
});

test('should fire non-pointer events inside View with pointerEvents="box-none"', () => {
  const onTouchStart = jest.fn();
  const screen = render(
    <View testID="view" pointerEvents="box-none" onTouchStart={onTouchStart} />
  );

  fireEvent(screen.getByTestId('view'), 'touchStart');
  expect(onTouchStart).toHaveBeenCalled();
});

test('should fire non-touch events inside View with pointerEvents="box-none"', () => {
  const onLayout = jest.fn();
  const screen = render(
    <View testID="view" pointerEvents="box-none" onLayout={onLayout} />
  );

  fireEvent(screen.getByTestId('view'), 'layout');
  expect(onLayout).toHaveBeenCalled();
});

// This test if pointerEvents="box-only" on composite `Pressable` is blocking
// the 'press' event on host View rendered by pressable.
test('should fire on Pressable with pointerEvents="box-only', () => {
  const onPress = jest.fn();
  const screen = render(
    <Pressable testID="pressable" pointerEvents="box-only" onPress={onPress} />
  );

  fireEvent.press(screen.getByTestId('pressable'));
  expect(onPress).toHaveBeenCalled();
});

test('should pass event up on disabled TouchableOpacity', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  const screen = render(
    <TouchableOpacity onPress={handleOuterPress}>
      <TouchableOpacity onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  fireEvent.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

test('should pass event up on disabled Pressable', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  const screen = render(
    <Pressable onPress={handleOuterPress}>
      <Pressable onPress={handleInnerPress} disabled={true}>
        <Text>Inner Trigger</Text>
      </Pressable>
    </Pressable>
  );

  fireEvent.press(screen.getByText('Inner Trigger'));
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
  const screen = render(
    <TestComponent onPress={handlePress} disabled={true} />
  );

  fireEvent.press(screen.getByText('Trigger Test'));
  expect(handlePress).toHaveBeenCalledTimes(1);
});

type TestChildTouchableComponentProps = {
  onPress: () => void;
  someProp: boolean;
};
function TestChildTouchableComponent({
  onPress,
  someProp,
}: TestChildTouchableComponentProps) {
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

  const screen = render(
    <View>
      <TestChildTouchableComponent onPress={handlePress} someProp={true} />
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
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

  const screen = render(<TestDraggableComponent onDrag={handleDrag} />);

  fireEvent(screen.getByText('Trigger'), 'responderMove', {
    touchHistory: { mostRecentTimeStamp: '2', touchBank: [] },
  });
  expect(handleDrag).toHaveBeenCalled();
});

// Those events ideally should be triggered through `fireEvent.scroll`, but they are handled at the
// native level, so we need to support manually triggering them
describe('native events', () => {
  test('triggers onScrollBeginDrag', () => {
    const onScrollBeginDragSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollView testID="test-id" onScrollBeginDrag={onScrollBeginDragSpy} />
    );

    fireEvent(getByTestId('test-id'), 'onScrollBeginDrag');
    expect(onScrollBeginDragSpy).toHaveBeenCalled();
  });

  test('triggers onScrollEndDrag', () => {
    const onScrollEndDragSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollView testID="test-id" onScrollEndDrag={onScrollEndDragSpy} />
    );

    fireEvent(getByTestId('test-id'), 'onScrollEndDrag');
    expect(onScrollEndDragSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollBegin', () => {
    const onMomentumScrollBeginSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollView
        testID="test-id"
        onMomentumScrollBegin={onMomentumScrollBeginSpy}
      />
    );

    fireEvent(getByTestId('test-id'), 'onMomentumScrollBegin');
    expect(onMomentumScrollBeginSpy).toHaveBeenCalled();
  });

  test('triggers onMomentumScrollEnd', () => {
    const onMomentumScrollEndSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollView
        testID="test-id"
        onMomentumScrollEnd={onMomentumScrollEndSpy}
      />
    );

    fireEvent(getByTestId('test-id'), 'onMomentumScrollEnd');
    expect(onMomentumScrollEndSpy).toHaveBeenCalled();
  });
});
