// @flow
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { render, fireEvent } from '..';

const OnPressComponent = ({ onPress }) => (
  <View>
    <TouchableOpacity onPress={onPress} testID="button">
      <Text testID="text-button">Press me</Text>
    </TouchableOpacity>
  </View>
);

const WithoutEventComponent = () => (
  <View>
    <Text testID="text">Content</Text>
  </View>
);

const CustomEventComponent = ({ onCustomEvent }) => (
  <TouchableOpacity onPress={onCustomEvent}>
    <Text>Click me</Text>
  </TouchableOpacity>
);

const MyCustomButton = ({ handlePress }) => (
  <OnPressComponent onPress={handlePress} />
);

const CustomEventComponentWithCustomName = ({ handlePress }) => (
  <MyCustomButton testID="my-custom-button" handlePress={handlePress} />
);

describe('fireEvent', () => {
  test('should invoke specified event', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<OnPressComponent onPress={onPressMock} />);

    fireEvent(getByTestId('button'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke specified event on parent element', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<OnPressComponent onPress={onPressMock} />);

    fireEvent(getByTestId('text-button'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should throw an Error when event handler was not found', () => {
    const { getByTestId } = render(<WithoutEventComponent />);

    expect(() => fireEvent(getByTestId('text'), 'press')).toThrow(
      'No handler function found for event: "press"'
    );
  });

  test('should invoke event with custom name', () => {
    const handlerMock = jest.fn();
    const EVENT_DATA = 'event data';

    const { getByTestId } = render(
      <View>
        <CustomEventComponent testID="custom" onCustomEvent={handlerMock} />
      </View>
    );

    fireEvent(getByTestId('custom'), 'customEvent', EVENT_DATA);

    expect(handlerMock).toHaveBeenCalledWith(EVENT_DATA);
  });

  test('should not bubble event to root element', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <TouchableOpacity onPress={onPressMock}>
        <Text testID="test">Content</Text>
      </TouchableOpacity>
    );

    expect(() => fireEvent.press(getByTestId('test'))).toThrow();
    expect(onPressMock).not.toHaveBeenCalled();
  });
});

test('fireEvent.press', () => {
  const onPressMock = jest.fn();
  const { getByTestId } = render(<OnPressComponent onPress={onPressMock} />);

  fireEvent.press(getByTestId('text-button'));

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

  const { getByTestId } = render(
    <ScrollView testID="scroll-view" onScroll={onScrollMock}>
      <Text>XD</Text>
    </ScrollView>
  );

  fireEvent.scroll(getByTestId('scroll-view'), eventData);

  expect(onScrollMock).toHaveBeenCalledWith(eventData);
});

test('fireEvent.changeText', () => {
  const onChangeTextMock = jest.fn();
  const CHANGE_TEXT = 'content';

  const { getByTestId } = render(
    <View>
      <TextInput testID="text-input" onChangeText={onChangeTextMock} />
    </View>
  );

  fireEvent.changeText(getByTestId('text-input'), CHANGE_TEXT);

  expect(onChangeTextMock).toHaveBeenCalledWith(CHANGE_TEXT);
});

test('custom component with custom event name', () => {
  const handlePress = jest.fn();

  const { getByTestId } = render(
    <CustomEventComponentWithCustomName handlePress={handlePress} />
  );

  fireEvent(getByTestId('my-custom-button'), 'handlePress');

  expect(handlePress).toHaveBeenCalled();
});

test('event with multiple handler parameters', () => {
  const handlePress = jest.fn();

  const { getByTestId } = render(
    <CustomEventComponentWithCustomName handlePress={handlePress} />
  );

  fireEvent(getByTestId('my-custom-button'), 'handlePress', 'param1', 'param2');

  expect(handlePress).toHaveBeenCalledWith('param1', 'param2');
});
