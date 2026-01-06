import { render } from '@testing-library/react-native';

test('renders multiple', () => {
  render(<Comp1 />);
  render(<Comp2 />);
});
