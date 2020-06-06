// @flow
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitForElementToBeRemoved } from '..';

const TestSetup = () => {
  const [isAdded, setIsAdded] = useState(true);

  const removeElement = async () => {
    setTimeout(() => setIsAdded(false), 300);
  };

  return (
    <View>
      {isAdded && <Text>Observed Element</Text>}

      <TouchableOpacity onPress={removeElement}>
        <Text>Remove Element</Text>
      </TouchableOpacity>
    </View>
  );
};

test('waits when using getBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.getByText('Observed Element')).toBeTruthy();

  await waitForElementToBeRemoved(() => screen.getByText('Observed Element'));
  expect(screen.queryByText('Observed Element')).toBeNull();
});

test('waits when using getAllBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.getByText('Observed Element')).toBeTruthy();

  await waitForElementToBeRemoved(() =>
    screen.getAllByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
});

test('waits when using queryBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.getByText('Observed Element')).toBeTruthy();

  await waitForElementToBeRemoved(() => screen.queryByText('Observed Element'));
  expect(screen.queryByText('Observed Element')).toBeNull();
});

test('waits when using queryAllBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.getByText('Observed Element')).toBeTruthy();

  await waitForElementToBeRemoved(() =>
    screen.queryAllByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
});

test('waits until timeout', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.getByText('Observed Element')).toBeTruthy();

  await expect(
    waitForElementToBeRemoved(() => screen.getByText('Observed Element'), {
      timeout: 100,
    })
  ).rejects.toThrow('Timed out in waitForElementToBeRemoved.');

  // Async action ends after 300ms and we only waited 100ms, so we need to wait for the remaining
  // async actions to finish
  await waitForElementToBeRemoved(() => screen.getByText('Observed Element'));
});

test('waits with custom interval', async () => {
  const mockFn = jest.fn(() => <View />);

  try {
    await waitForElementToBeRemoved(() => mockFn(), {
      timeout: 400,
      interval: 200,
    });
  } catch (e) {
    // Suppress expected error
  }

  expect(mockFn).toHaveBeenCalledTimes(3);
});

test('works with fake timers', async () => {
  jest.useFakeTimers();

  const mockFn = jest.fn(() => <View />);

  waitForElementToBeRemoved(() => mockFn(), {
    timeout: 400,
    interval: 200,
  });

  jest.advanceTimersByTime(400);
  expect(mockFn).toHaveBeenCalledTimes(3);
});
