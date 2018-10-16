// @flow
/* eslint-disable no-console */
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import stripAnsi from 'strip-ansi';
import { debug } from '..';

function TextComponent({ text }) {
  return <Text>{text}</Text>;
}

class Button extends React.Component<*> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <TextComponent text={this.props.text} />
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
