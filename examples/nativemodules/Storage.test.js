import React from 'react';
import { fireEvent, render, act } from 'react-native-testing-library';
import StorageView from './StorageView';

/* eslint-disable jest/no-test-callback */

// Mock the react-native-testing-library
// For this test case, we are interested in mocking just 'getItem' and 'setItem'
jest.mock('@react-native-community/async-storage', () => {
  const __INTERNAL_MOCK_STORAGE__ = {};

  return {
    __INTERNAL_MOCK_STORAGE__,

    setItem: jest.fn(async (key, value, callback) => {
      const result = (__INTERNAL_MOCK_STORAGE__[key] = value);
      callback && callback(result);
      return result;
    }),

    getItem: jest.fn(async (key, callback) => {
      const result = __INTERNAL_MOCK_STORAGE__[key];
      callback && callback();
      return result;
    }),
  };
});

describe('Native module test', () => {
  test('increments the counter the Increment is pressed', async (done) => {
    const { getByText } = render(<StorageView />);
    const button = getByText(/Increment/i);
    fireEvent.press(button);

    const populateBtn = getByText(/Populate/i);
    await act(async () => {
      fireEvent.press(populateBtn);
    });

    const text = getByText(/Counter/);
    expect(text.props.children.join('')).toEqual('Counter 1');

    done();
  });
});
