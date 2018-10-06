import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from 'react-native'; // eslint-disable-line import/no-unresolved
import fireEvent from '../fireEvent';
import { render } from '..';

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

jest.mock(
  'react-native',
  () => ({
    View(props) {
      return props.children;
    },
    ScrollView(props) {
      return props.children;
    },
    Text(props) {
      return props.children;
    },
    TextInput() {
      return null;
    },
    TouchableOpacity(props) {
      return props.children;
    },
  }),
  { virtual: true }
);

describe('fireEvent.invokeEvent', () => {
  test('should invoke specified event', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<OnPressComponent onPress={onPressMock} />);

    fireEvent.invokeEvent(getByTestId('button'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should invoke specified event on parent element', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<OnPressComponent onPress={onPressMock} />);

    fireEvent.invokeEvent(getByTestId('text-button'), 'press');

    expect(onPressMock).toHaveBeenCalled();
  });

  test('should throw an Error when event handler was not found', () => {
    const { getByTestId } = render(<WithoutEventComponent />);

    expect(() =>
      fireEvent.invokeEvent(getByTestId('text'), 'press')
    ).toThrowError('No handler function found for event: press');
  });

  test('should invoke event with custom name', () => {
    const handlerMock = jest.fn();
    const EVENT_DATA = 'event data';

    const { getByTestId } = render(
      <View>
        <CustomEventComponent testID="custom" onCustomEvent={handlerMock} />
      </View>
    );

    fireEvent.invokeEvent(getByTestId('custom'), 'customEvent', EVENT_DATA);

    expect(handlerMock).toHaveBeenCalledWith(EVENT_DATA);
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

test('fireEvent.doublePress', () => {
  const onDoublePressMock = jest.fn();

  const { getByTestId } = render(
    <TouchableOpacity onDoublePress={onDoublePressMock}>
      <Text testID="button-text">Click me</Text>
    </TouchableOpacity>
  );

  fireEvent.doublePress(getByTestId('button-text'));

  expect(onDoublePressMock).toHaveBeenCalled();
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
