import * as React from 'react';
import { Animated, ViewStyle } from 'react-native';

type AnimatedViewProps = {
  fadeInDuration?: number;
  style?: ViewStyle;
  children: React.ReactNode;
  useNativeDriver?: boolean;
};

export function AnimatedView(props: AnimatedViewProps) {
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
