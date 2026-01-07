import { render } from '@testing-library/react-native';

test.only('only this test', () => {
  render(<Component />);
});

it.only('only this it', () => {
  render(<Component />);
});
