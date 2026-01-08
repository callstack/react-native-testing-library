import * as React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '..';

it('finds text elements using partial matching when exact option is false', async () => {
  const Component = () => (
    <View>
      <Text>Welcome to the app</Text>
      <Text>Hello World</Text>
    </View>
  );

  await render(<Component />);

  // Users commonly use exact: false to find elements by partial text matches
  // This is critical for testing components with dynamic or long text content
  const element = screen.getByText('World', { exact: false });
  expect(element).toBeOnTheScreen();
  expect(element.props.children).toBe('Hello World');
});
