import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

function Greeting({ name = 'World' }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  );
}

describe('Greeting', () => {
  it('should re-render when name changes', () => {
    render(<Greeting name="John" />);
    expect(screen.getByText('Hello, John!')).toBeOnTheScreen();

    screen.rerender(<Greeting name="Jane" />);
    expect(screen.getByText('Hello, Jane!')).toBeOnTheScreen();
  });

  it('should unmount', () => {
    render(<Greeting name="John" />);

    screen.unmount();
    expect(() => screen.getByText('Hello, John!')).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find node on an unmounted component."`,
    );
  });
});
