import * as React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import act from '../act';
import render from '../render';
import fireEvent from '../fireEvent';

type UseEffectProps = { callback(): void };
const UseEffect = ({ callback }: UseEffectProps) => {
  React.useEffect(callback);
  return null;
};

const Counter = () => {
  const [count, setCount] = React.useState(0);

  const text = `Total count: ${count}`;
  return <Text onPress={() => setCount(count + 1)}>{text}</Text>;
};

test('render should trigger useEffect', () => {
  const effectCallback = jest.fn();
  render(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(1);
});

test('update should trigger useEffect', () => {
  const effectCallback = jest.fn();
  const { update } = render(<UseEffect callback={effectCallback} />);
  update(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(2);
});

test('fireEvent should trigger useState', () => {
  const { getByText } = render(<Counter />);
  const counter = getByText(/Total count/i);

  expect(counter.props.children).toEqual('Total count: 0');
  fireEvent.press(counter);
  expect(counter.props.children).toEqual('Total count: 1');
});

test('should act even if there is no act in react-test-renderer', () => {
  // @ts-ignore
  ReactTestRenderer.act = undefined;
  const callback = jest.fn();

  act(() => {
    callback();
  });

  expect(callback).toHaveBeenCalled();
});
