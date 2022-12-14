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
import { defaultPressEvent, pressEvent } from '../helpers/create-event';

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

test('fireEvent.press with default event', () => {
  const onPressMock = jest.fn();
  const view = render(<Pressable testID="pressable" onPress={onPressMock} />);

  fireEvent.press(view.getByTestId('pressable'));
  expect(onPressMock).toHaveBeenCalledWith({ nativeEvent: defaultPressEvent });
});

test('fireEvent.press with default event override', () => {
  const onPressMock = jest.fn();
  const view = render(<Pressable testID="pressable" onPress={onPressMock} />);

  fireEvent.press(view.getByTestId('pressable'), { pageX: 10, pageY: 20 });
  expect(onPressMock).toHaveBeenCalledWith({
    nativeEvent: { ...defaultPressEvent, pageX: 10, pageY: 20 },
  });
});

test('fireEvent.press with explicit event', () => {
  const onPressMock = jest.fn();
  const view = render(<Pressable testID="pressable" onPress={onPressMock} />);

  const event = {
    nativeEvent: { pageX: 20, pageY: 30 },
  };
  fireEvent.press(view.getByTestId('pressable'), event);
  expect(onPressMock).toHaveBeenCalledWith(event);
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

test('should not fire on non-editable TextInput', () => {
  const placeholder = 'Test placeholder';
  const onChangeTextMock = jest.fn();
  const NEW_TEXT = 'New text';

  const { getByPlaceholderText } = render(
    <View>
      <TextInput
        editable={false}
        placeholder={placeholder}
        onChangeText={onChangeTextMock}
      />
    </View>
  );

  fireEvent.changeText(getByPlaceholderText(placeholder), NEW_TEXT);
  expect(onChangeTextMock).not.toHaveBeenCalled();
});

test('should not fire on non-editable host TextInput', () => {
  const testID = 'my-text-input';
  const onChangeTextMock = jest.fn();
  const NEW_TEXT = 'New text';

  const { getByTestId } = render(
    <TextInput
      editable={false}
      testID={testID}
      onChangeText={onChangeTextMock}
      placeholder="placeholder"
    />
  );

  fireEvent.changeText(getByTestId(testID), NEW_TEXT);
  expect(onChangeTextMock).not.toHaveBeenCalled();
});

test('should not fire on non-editable TextInput with nested Text', () => {
  const placeholder = 'Test placeholder';
  const onChangeTextMock = jest.fn();
  const NEW_TEXT = 'New text';

  const { getByPlaceholderText } = render(
    <View>
      <TextInput
        editable={false}
        placeholder={placeholder}
        onChangeText={onChangeTextMock}
      >
        <Text>Test text</Text>
      </TextInput>
    </View>
  );

  fireEvent.changeText(getByPlaceholderText(placeholder), NEW_TEXT);
  expect(onChangeTextMock).not.toHaveBeenCalled();
});

test('should not fire on none pointerEvents View', () => {
  const handlePress = jest.fn();

  const screen = render(
    <View pointerEvents="none">
      <Pressable onPress={handlePress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire on box-only pointerEvents View', () => {
  const handlePress = jest.fn();

  const screen = render(
    <View pointerEvents="box-only">
      <Pressable onPress={handlePress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should fire on box-none pointerEvents View', () => {
  const handlePress = jest.fn();

  const screen = render(
    <View pointerEvents="box-none">
      <Pressable onPress={handlePress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).toHaveBeenCalled();
});

test('should fire on auto pointerEvents View', () => {
  const handlePress = jest.fn();

  const screen = render(
    <View pointerEvents="auto">
      <Pressable onPress={handlePress}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).toHaveBeenCalled();
});

test('should not fire on box-only pointerEvents View with nested elements', () => {
  const handlePress = jest.fn();

  const screen = render(
    <View pointerEvents="box-only">
      <View>
        <Pressable onPress={handlePress}>
          <Text>Trigger</Text>
        </Pressable>
      </View>
    </View>
  );

  fireEvent.press(screen.getByText('Trigger'));
  expect(handlePress).not.toHaveBeenCalled();
});

test('should fire non-pointer events on box-none pointerEvents View', () => {
  const handleTouchStart = jest.fn();

  const screen = render(
    <View
      pointerEvents="box-none"
      onTouchStart={handleTouchStart}
      testID="touch-start-view"
    >
      <Pressable onPress={() => {}}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent(screen.getByTestId('touch-start-view'), 'touchStart');
  expect(handleTouchStart).toHaveBeenCalled();
});

test('should fire non-touch events on box-none pointerEvents View', () => {
  const handleLayout = jest.fn();

  const screen = render(
    <View pointerEvents="box-none" onLayout={handleLayout} testID="layout-view">
      <Pressable onPress={() => {}}>
        <Text>Trigger</Text>
      </Pressable>
    </View>
  );

  fireEvent(screen.getByTestId('layout-view'), 'layout');
  expect(handleLayout).toHaveBeenCalled();
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
