import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { wait } from '../wait';
import render from '../../../render';
import { screen } from '../../../screen';

beforeEach(() => {
  jest.useRealTimers();
});

describe('wait()', () => {
  it('wait works with real timers', async () => {
    jest.spyOn(globalThis, 'setTimeout');
    const advanceTimers = jest.fn(() => Promise.resolve());
    await wait({ delay: 20, advanceTimers });

    expect(globalThis.setTimeout).toHaveBeenCalledTimes(1);
    expect(globalThis.setTimeout).toHaveBeenCalledWith(expect.anything(), 20);
    expect(advanceTimers).toHaveBeenCalledTimes(1);
    expect(advanceTimers).toHaveBeenCalledWith(20);
  });

  it.each(['modern', 'legacy'])(
    'wait works with %s fake timers',
    async (type) => {
      jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });
      jest.spyOn(globalThis, 'setTimeout');
      const advanceTimers = jest.fn((n) => jest.advanceTimersByTime(n));
      await wait({ delay: 100, advanceTimers });

      expect(globalThis.setTimeout).toHaveBeenCalledTimes(1);
      expect(globalThis.setTimeout).toHaveBeenCalledWith(
        expect.anything(),
        100
      );
      expect(advanceTimers).toHaveBeenCalledTimes(1);
      expect(advanceTimers).toHaveBeenCalledWith(100);
    }
  );

  it('wait with null delay does not wait with real timers', async () => {
    jest.spyOn(globalThis, 'setTimeout');
    const advanceTimers = jest.fn();

    // @ts-expect-error
    await wait({ delay: null, advanceTimers });

    expect(globalThis.setTimeout).not.toHaveBeenCalled();
    expect(advanceTimers).not.toHaveBeenCalled();
  });

  it.each(['modern', 'legacy'])(
    'wait with null delay does not wait with %s fake timers',
    async (type) => {
      jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });
      jest.spyOn(globalThis, 'setTimeout');
      const advanceTimers = jest.fn();

      // @ts-expect-error
      await wait({ delay: null, advanceTimers });

      expect(globalThis.setTimeout).not.toHaveBeenCalled();
      expect(advanceTimers).not.toHaveBeenCalled();
    }
  );

  it('is wrapped by act', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    jest.useFakeTimers();
    const TestComponent = () => {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }, []);

      if (isVisible) {
        return <Text>Visible</Text>;
      }

      return null;
    };

    render(<TestComponent />);

    await wait({ delay: 100, advanceTimers: jest.advanceTimersByTime });

    expect(screen.getByText('Visible')).toBeTruthy();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
