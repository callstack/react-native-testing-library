// @flow
import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import act from '../act';
import render from '../render';
import fireEvent from '../fireEvent';

const UseEffect = ({ callback }: { callback: Function }) => {
  React.useEffect(callback);
  return null;
};

const Counter = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Text testID="counter" onPress={() => setCount(count + 1)}>
      {count}
    </Text>
  );
};

test('render should trigger useEffect', () => {
  const effectCallback = jest.fn();
  render(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(1);
});

test('updaate should trigger useEffect', () => {
  const effectCallback = jest.fn();
  const { update } = render(<UseEffect callback={effectCallback} />);
  update(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(2);
});

test('fireEvent should trigger useState', () => {
  const { getByTestId } = render(<Counter />);
  const counter = getByTestId('counter');

  expect(counter.props.children).toEqual(0);
  fireEvent.press(counter);
  expect(counter.props.children).toEqual(1);
});

test('should act even if there is no act in react-test-renderer', () => {
  // $FlowFixMe
  ReactTestRenderer.act = undefined;
  const callback = jest.fn();

  act(() => {
    callback();
  });

  expect(callback).toHaveBeenCalled();
});
