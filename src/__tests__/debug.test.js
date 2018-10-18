// @flow
/* eslint-disable no-console */
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import stripAnsi from 'strip-ansi';
import { debug, render, fireEvent, flushMicrotasksQueue } from '..';

function TextComponent({ text }) {
  return <Text>{text}</Text>;
}

class Button extends React.Component<*, *> {
  state = { counter: 0 };

  onPress = async () => {
    await Promise.resolve();

    this.setState({ counter: 1 });
    this.props.onPress();
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <TextComponent text={`${this.props.text} ${this.state.counter}`} />
      </TouchableOpacity>
    );
  }
}

test('debug', () => {
  // $FlowFixMe
  console.log = jest.fn();
  const component = <Button onPress={jest.fn} text="Press me" />;
  debug(component);

  const output = console.log.mock.calls[0][0];

  expect(stripAnsi(output)).not.toEqual(output);
  expect(stripAnsi(output)).toMatchSnapshot();

  console.log.mockReset();

  debug(component, 'test message');

  expect(console.log).toBeCalledWith(output, 'test message');
});

test('debug.shallow', () => {
  expect(debug.shallow).toBe(debug);
});

test('debug.deep', () => {
  // $FlowFixMe
  console.log = jest.fn();
  const component = <Button onPress={jest.fn} text="Press me" />;
  debug.deep(component);

  const output = console.log.mock.calls[0][0];

  expect(stripAnsi(output)).not.toEqual(output);
  expect(stripAnsi(output)).toMatchSnapshot();

  console.log.mockReset();

  debug.deep(component, 'test message');

  expect(console.log).toBeCalledWith(output, 'test message');
});

test('debug.deep async test', async () => {
  // $FlowFixMe
  console.log = jest.fn();
  const { toJSON, getByName } = render(
    <Button onPress={jest.fn} text="Press me" />
  );

  fireEvent.press(getByName('TouchableOpacity'));
  await flushMicrotasksQueue();

  debug.deep(toJSON());

  const output = console.log.mock.calls[0][0];

  expect(stripAnsi(output)).toMatchSnapshot();
});
