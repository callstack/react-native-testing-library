// @flow
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

const OnPressComponent = ({ onPress, text }) => (
  <View>
    <TouchableOpacity onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  </View>
);

const WithoutEventComponent = () => (
  <View>
    <Text>Without event</Text>
  </View>
);

const CustomEventComponent = ({ onCustomEvent }) => (
  <TouchableOpacity onPress={onCustomEvent}>
    <Text>Custom event component</Text>
  </TouchableOpacity>
);

const MyCustomButton = ({ handlePress, text }) => (
  <OnPressComponent onPress={handlePress} text={text} />
);

const CustomEventComponentWithCustomName = ({ handlePress }) => (
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

  test('should throw an Error when event handler was not found', () => {
    const { getByText } = render(
      <WithoutEventComponent onPress={() => 'this is not passed to children'} />
    );

    expect(() => fireEvent(getByText('Without event'), 'press')).toThrow(
      'No handler function found for event: "press"'
    );
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
  const { getByText } = render(
    <OnPressComponent onPress={onPressMock} text={text} />
  );

  fireEvent.press(getByText(text));

  expect(onPressMock).toHaveBeenCalled();
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

const TestComponent = ({ onPress }) => {
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

function TestChildTouchableComponent({ onPress, someProp }) {
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

function TestDraggableComponent({ onDrag }) {
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
