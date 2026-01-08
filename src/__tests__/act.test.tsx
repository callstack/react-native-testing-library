import * as React from 'react';
import { Text } from 'react-native';

import { act, fireEvent, render, screen } from '..';
import { getIsReactActEnvironment } from '../act';

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

test('render should trigger useEffect', async () => {
  const effectCallback = jest.fn();
  await render(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(1);
});

test('rerender should trigger useEffect', async () => {
  const effectCallback = jest.fn();
  await render(<UseEffect callback={effectCallback} />);
  await screen.rerender(<UseEffect callback={effectCallback} />);

  expect(effectCallback).toHaveBeenCalledTimes(2);
});

test('fireEvent should trigger useState', async () => {
  await render(<Counter />);
  const counter = screen.getByText(/Total count/i);

  expect(counter.props.children).toEqual('Total count: 0');
  await fireEvent.press(counter);
  expect(counter.props.children).toEqual('Total count: 1');
});

test('should be able to await act', async () => {
  const result = await act(async () => {});
  expect(result).toBe(undefined);
});

test('should be able to await act when promise rejects', async () => {
  await expect(act(() => Promise.reject('error'))).rejects.toBe('error');
});

test('should restore act environment when callback throws synchronously', async () => {
  const previousEnvironment = getIsReactActEnvironment();
  
  const testError = new Error('Synchronous error in act');
  
  try {
    await act(() => {
      throw testError;
    });
    // Should not reach here
    expect(true).toBe(false);
  } catch (error) {
    expect(error).toBe(testError);
  }
  
  // Verify the act environment was restored even after error
  expect(getIsReactActEnvironment()).toBe(previousEnvironment);
});

test('should restore act environment when callback returns non-promise value', async () => {
  const previousEnvironment = getIsReactActEnvironment();
  
  // Call act with a callback that returns a non-promise value
  // This tests the else branch in withGlobalActEnvironment
  const result = await act(() => {
    return 42;
  });
  
  expect(result).toBe(42);
  // Verify the act environment was restored
  expect(getIsReactActEnvironment()).toBe(previousEnvironment);
});
