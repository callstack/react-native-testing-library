import * as React from 'react';
import { Text, View } from 'react-native';
import './matchers/extend-expect';
import { render } from './render';
import { screen } from './screen';

it('renders a React Native component and makes it queryable', async () => {
  const Component = () => (
    <View>
      <Text>Hello World</Text>
    </View>
  );

  await render(<Component />);

  expect(screen.getByText('Hello World')).toBeOnTheScreen();
});
