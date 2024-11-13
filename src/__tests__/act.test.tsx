import * as React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '../';

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
  render(<UseEffect callback={effectCallback} />);
  screen.update(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(2);
});

test('fireEvent should trigger useState', () => {
  render(<Counter />);
  const counter = screen.getByText(/Total count/i);

  expect(counter).toHaveTextContent('Total count: 0');
  fireEvent.press(counter);
  expect(counter).toHaveTextContent('Total count: 1');
});

test('should be able to not await act', () => {
  const result = act(() => {});
  expect(result).toHaveProperty('then');
});

test('should be able to await act', async () => {
  const result = await act(async () => {});
  expect(result).toBe(undefined);
});

test('should be able to await act when promise rejects', async () => {
  await expect(act(() => Promise.reject('error'))).rejects.toBe('error');
});
