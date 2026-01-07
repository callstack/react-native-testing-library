import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent methods', () => {
  render(<MyComponent />);
  const input = screen.getByPlaceholderText('Enter text');
  const button = screen.getByRole('button');
  const scrollView = screen.getByTestId('scroll-view');

  fireEvent.press(button);
  fireEvent.changeText(input, 'Hello');
  fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 100 } } });

  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
