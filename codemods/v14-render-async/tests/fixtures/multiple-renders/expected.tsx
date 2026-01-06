import { render } from '@testing-library/react-native';

test('renders multiple', async () => {
  await render(<Comp1 />);
  await render(<Comp2 />);
});
