import { render } from '@testing-library/react-native';

test.only('only this test', async () => {
  await render(<Component />);
});

it.only('only this it', async () => {
  await render(<Component />);
});
