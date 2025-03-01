import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { Animated } from 'react-native';

import { act, render, screen } from '..';

type AnimatedViewProps = {
  fadeInDuration?: number;
  style?: ViewStyle;
  children: React.ReactNode;
  useNativeDriver?: boolean;
};

function AnimatedView(props: AnimatedViewProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: props.fadeInDuration ?? 250,
      useNativeDriver: props.useNativeDriver ?? true,
    }).start();
  }, [fadeAnim, props.fadeInDuration, props.useNativeDriver]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
}

describe('AnimatedView', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should use native driver when useNativeDriver is true', () => {
    render(
      <AnimatedView fadeInDuration={250} useNativeDriver={true}>
        Test
      </AnimatedView>,
    );
    expect(screen.root).toHaveStyle({ opacity: 0 });

    act(() => jest.advanceTimersByTime(250));
    // This stopped working in tests in RN 0.77
    // expect(screen.root).toHaveStyle({ opacity: 0 });
  });

  it('should not use native driver when useNativeDriver is false', () => {
    render(
      <AnimatedView fadeInDuration={250} useNativeDriver={false}>
        Test
      </AnimatedView>,
    );
    expect(screen.root).toHaveStyle({ opacity: 0 });

    act(() => jest.advanceTimersByTime(250));
    expect(screen.root).toHaveStyle({ opacity: 1 });
  });
});
