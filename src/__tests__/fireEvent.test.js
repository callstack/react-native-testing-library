// @flow
import React from 'react';
import {
  View,
  TouchableOpacity,
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
    <TouchableOpacity onPress={handlePress} disabled={true}>
      <Text>Trigger</Text>
    </TouchableOpacity>
  );

  expect(() => fireEvent.press(screen.getByText('Trigger'))).toThrow(
    'No handler function found for event: "press"'
  );
  expect(handlePress).not.toHaveBeenCalled();
});

test('should not fire on disabled Pressable', () => {
  const handlePress = jest.fn();
  const screen = render(
    <Pressable onPress={handlePress} disabled={true}>
      <Text>Trigger</Text>
    </Pressable>
  );

  expect(() => fireEvent.press(screen.getByText('Trigger'))).toThrow(
    'No handler function found for event: "press"'
  );
  expect(handlePress).not.toHaveBeenCalled();
});

test('should pass event up on disabled TouchableOpacity', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  const screen = render(
    <TouchableOpacity
      testID="Outer"
      onPress={handleOuterPress}
      disabled={false}
    >
      <TouchableOpacity
        testID="Inner"
        onPress={handleInnerPress}
        disabled={true}
      >
        <Text testID="Text">Inner Trigger</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  fireEvent.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});

test.only('should pass event up on disabled Pressable', () => {
  const handleInnerPress = jest.fn();
  const handleOuterPress = jest.fn();
  const screen = render(
    <Pressable testID="Outer" onPress={handleOuterPress} disabled={false}>
      <Pressable testID="Inner" onPress={handleInnerPress} disabled={true}>
        <Text testID="Text">Inner Trigger</Text>
      </Pressable>
    </Pressable>
  );

  fireEvent.press(screen.getByText('Inner Trigger'));
  expect(handleInnerPress).not.toHaveBeenCalled();
  expect(handleOuterPress).toHaveBeenCalledTimes(1);
});
