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
  it('should render', () => {
    // Arrange
    render(<Greeting />);

    // Assert`
    expect(screen.getByText('Hello, World!')).toBeOnTheScreen();
  });

  it('should render with the correct name', () => {
    // Arrange
    render(<Greeting name="John" />);

    // Assert
    expect(screen.getByText('Hello, John!')).toBeOnTheScreen();
  });
});
