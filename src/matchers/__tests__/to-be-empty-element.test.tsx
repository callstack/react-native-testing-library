import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

it('identifies empty elements', async () => {
  const Component = () => (
    <View>
      <View testID="empty" />
      <View testID="with-children">
        <Text>Content</Text>
      </View>
    </View>
  );

  await render(<Component />);

  expect(screen.getByTestId('empty')).toBeEmptyElement();
  expect(screen.getByTestId('with-children')).not.toBeEmptyElement();
});
