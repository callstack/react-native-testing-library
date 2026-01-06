import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent methods', async () => {
  await render(<MyComponent />);
  const input = screen.getByPlaceholderText('Enter text');
  const button = screen.getByRole('button');
  const scrollView = screen.getByTestId('scroll-view');
  
  await fireEvent.press(button);
  await fireEvent.changeText(input, 'Hello');
  await fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { y: 100 } } });
  
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
