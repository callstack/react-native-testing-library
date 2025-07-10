import * as React from 'react';
import { Text, View, Button } from 'react-native';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Text>{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}

describe('Counter', () => {
  it('should increment the count', async () => {
    const user = userEvent.setup();

    render(<Counter />);
    expect(screen.getByText('0')).toBeOnTheScreen();

    const button = screen.getByRole('button', { name: 'Increment' });
    expect(button).toBeOnTheScreen();

    await user.press(button);
    expect(screen.getByText('1')).toBeOnTheScreen();
  });

  it('should increment the count when the button is pressed', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeOnTheScreen();

    const button = screen.getByRole('button', { name: 'Increment' });
    expect(button).toBeOnTheScreen();

    fireEvent.press(button);
    expect(screen.getByText('1')).toBeOnTheScreen();
  });
});
