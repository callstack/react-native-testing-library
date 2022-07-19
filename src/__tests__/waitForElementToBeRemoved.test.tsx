import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitForElementToBeRemoved } from '..';

const TestSetup = ({ shouldUseDelay = true }) => {
  const [isAdded, setIsAdded] = useState(true);

  const removeElement = async () => {
    if (shouldUseDelay) {
      setTimeout(() => setIsAdded(false), 300);
    } else {
      setIsAdded(false);
    }
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

afterEach(() => {
  jest.useRealTimers();
});

test('waits when using getBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  const element = screen.getByText('Observed Element');
  expect(element).toBeTruthy();

  const result = await waitForElementToBeRemoved(() =>
    screen.getByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
  expect(result).toEqual(element);
});

test('waits when using getAllBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  const elements = screen.getAllByText('Observed Element');
  expect(elements).toBeTruthy();

  const result = await waitForElementToBeRemoved(() =>
    screen.getAllByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
  expect(result).toEqual(elements);
});

test('waits when using queryBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  const element = screen.getByText('Observed Element');
  expect(element).toBeTruthy();

  const result = await waitForElementToBeRemoved(() =>
    screen.queryByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
  expect(result).toEqual(element);
});

test('waits when using queryAllBy query', async () => {
  const screen = render(<TestSetup />);

  fireEvent.press(screen.getByText('Remove Element'));
  const elements = screen.getAllByText('Observed Element');
  expect(elements).toBeTruthy();

  const result = await waitForElementToBeRemoved(() =>
    screen.queryAllByText('Observed Element')
  );
  expect(screen.queryByText('Observed Element')).toBeNull();
  expect(result).toEqual(elements);
});

test('checks if elements exist at start', async () => {
  const screen = render(<TestSetup shouldUseDelay={false} />);

  fireEvent.press(screen.getByText('Remove Element'));
  expect(screen.queryByText('Observed Element')).toBeNull();

  await expect(
    waitForElementToBeRemoved(() => screen.queryByText('Observed Element'))
  ).rejects.toThrow(
    'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.'
  );
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
      timeout: 600,
      interval: 200,
    });
  } catch (e) {
    // Suppress expected error
  }

  expect(mockFn).toHaveBeenCalledTimes(4);
});

test.each([false, true])(
  'works with fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });

    const mockFn = jest.fn(() => <View />);

    try {
      await waitForElementToBeRemoved(() => mockFn(), {
        timeout: 400,
        interval: 200,
      });
    } catch (e) {
      // Suppress expected error
    }

    // waitForElementToBeRemoved runs an initial call of the expectation
    expect(mockFn).toHaveBeenCalledTimes(4);
  }
);
