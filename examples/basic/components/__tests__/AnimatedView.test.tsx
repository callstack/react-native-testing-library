import * as React from 'react';
import { Text } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import { AnimatedView } from '../AnimatedView';

describe('AnimatedView', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should use native driver when useNativeDriver is true', async () => {
    render(
      <AnimatedView fadeInDuration={250} useNativeDriver={true}>
        <Text>Test</Text>
      </AnimatedView>,
    );
    expect(screen.root).toHaveStyle({ opacity: 0 });

    act(() => jest.advanceTimersByTime(250));
    // Does not work with native driver
    // expect(screen.root).toHaveStyle({ opacity: 1 });
  });

  it('should not use native driver when useNativeDriver is false', async () => {
    render(
      <AnimatedView fadeInDuration={250} useNativeDriver={false}>
        <Text>Test</Text>
      </AnimatedView>,
    );
    expect(screen.root).toHaveStyle({ opacity: 0 });

    act(() => jest.advanceTimersByTime(250));
    expect(screen.root).toHaveStyle({ opacity: 1 });
  });
});
