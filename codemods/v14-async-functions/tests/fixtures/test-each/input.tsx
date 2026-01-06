import { render } from '@testing-library/react-native';

test.each([
  { name: 'Alice' },
  { name: 'Bob' },
])('renders for $name', ({ name }) => {
  render(<Component name={name} />);
});

it.each([
  [1, 2, 3],
  [4, 5, 9],
])('adds %i and %i to get %i', (a, b, expected) => {
  render(<Component a={a} b={b} expected={expected} />);
});
