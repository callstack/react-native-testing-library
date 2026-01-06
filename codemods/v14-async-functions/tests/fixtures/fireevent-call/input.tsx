import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent', () => {
  render(<MyComponent />);
  const button = screen.getByRole('button');
  fireEvent(button, 'press');
  expect(screen.getByText('Clicked')).toBeOnTheScreen();
});
