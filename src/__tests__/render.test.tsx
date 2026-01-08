import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '..';

it('renders a React Native component and makes it queryable', async () => {
  const Component = () => (
    <View>
      <Text>Hello World</Text>
    </View>
  );

  await render(<Component />);

  expect(screen.getByText('Hello World')).toBeOnTheScreen();
});
