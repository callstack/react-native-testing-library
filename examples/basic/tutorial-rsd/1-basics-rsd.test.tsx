import * as React from 'react';
import { html } from 'react-strict-dom';
import { render, screen } from '@testing-library/react-native';

function Greeting({ name = 'World' }) {
  return (
    <html.div>
      <html.span>Hello, {name}!</html.span>
    </html.div>
  );
}

describe('Greeting', () => {
  it('should render', () => {
    // Arrange
    render(<Greeting />);

    // Assert
    expect(screen.getByText('Hello, World!')).toBeOnTheScreen();
  });

  it('should render with the correct name', () => {
    // Arrange
    render(<Greeting name="John" />);

    // Assert
    expect(screen.getByText('Hello, John!')).toBeOnTheScreen();
  });
});
