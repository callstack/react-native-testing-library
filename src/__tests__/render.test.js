/* eslint-disable react/no-multi-comp */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // eslint-disable-line import/no-unresolved
import { render } from '..';

jest.mock(
  'react-native',
  () => ({
    View(props) {
      return props.children;
    },
    Text(props) {
      return props.children;
    },
    TouchableOpacity(props) {
      return props.children;
    },
  }),
  { virtual: true }
);

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

class Banana extends React.Component {
  state = {
    fresh: false,
  };

  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  changeFresh = () => {
    this.setState(state => ({
      fresh: !state.fresh,
    }));
  };

  render() {
    return (
      <View>
        <Text>Is the banana fresh?</Text>
        <Text testID="bananaFresh">
          {this.state.fresh ? 'fresh' : 'not fresh'}
        </Text>
        <Button onPress={this.changeFresh} type="primary">
          Change freshness!
        </Button>
      </View>
    );
  }
}

test('getByTestId', () => {
  const { getByTestId } = render(<Banana />);
  const component = getByTestId('bananaFresh');

  expect(component.props.children).toBe('not fresh');
  expect(() => getByTestId('InExistent')).toThrow();
});

test('getByName', () => {
  const { getByTestId, getByName } = render(<Banana />);
  const bananaFresh = getByTestId('bananaFresh');
  const button = getByName('Button');

  button.props.onPress();

  expect(bananaFresh.props.children).toBe('fresh');

  const sameButton = getByName(Button);
  sameButton.props.onPress();

  expect(bananaFresh.props.children).toBe('not fresh');

  expect(() => getByName('InExistent')).toThrow();
});

test('getAllByName', () => {
  const { getAllByName } = render(<Banana />);
  const [text, status, button] = getAllByName('Text');

  expect(text.props.children).toBe('Is the banana fresh?');
  expect(status.props.children).toBe('not fresh');
  expect(button.props.children).toBe('Change freshness!');
  expect(() => getAllByName('InExistent')).toThrow();
});

test('getByText', () => {
  const { getByText } = render(<Banana />);
  const button = getByText(/change/i);

  expect(button.props.children).toBe('Change freshness!');

  const sameButton = getByText('not fresh');

  expect(sameButton.props.children).toBe('not fresh');
  expect(() => getByText('InExistent')).toThrow();
});

test('getAllByText', () => {
  const { getAllByText } = render(<Banana />);
  const button = getAllByText(/fresh/i);

  expect(button).toHaveLength(3);
  expect(() => getAllByText('InExistent')).toThrow();
});

test('getByProps', () => {
  const { getByProps } = render(<Banana />);
  const primaryType = getByProps({ type: 'primary' });

  expect(primaryType.props.children).toBe('Change freshness!');
  expect(() => getByProps({ type: 'inexistent' })).toThrow();
});

test('getAllByProps', () => {
  const { getAllByProps } = render(<Banana />);
  const primaryTypes = getAllByProps({ type: 'primary' });

  expect(primaryTypes).toHaveLength(1);
  expect(() => getAllByProps({ type: 'inexistent' })).toThrow();
});

test('update', () => {
  const fn = jest.fn();
  const { getByName, update } = render(<Banana onUpdate={fn} />);
  const button = getByName('Button');

  button.props.onPress();

  update(<Banana onUpdate={fn} />);

  expect(fn).toHaveBeenCalledTimes(2);
});

test('unmount', () => {
  const fn = jest.fn();
  const { unmount } = render(<Banana onUnmount={fn} />);
  unmount();
  expect(fn).toHaveBeenCalled();
});
