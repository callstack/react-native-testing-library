import { render } from '@testing-library/react-native';

test.each([
  { name: 'Alice' },
  { name: 'Bob' },
])('renders for $name', async ({ name }) => {
  await render(<Component name={name} />);
});

it.each([
  [1, 2, 3],
  [4, 5, 9],
])('adds %i and %i to get %i', async (a, b, expected) => {
  await render(<Component a={a} b={b} expected={expected} />);
});
