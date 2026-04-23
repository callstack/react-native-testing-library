import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';
import { testGateReact19_2 } from '../../test-utils/react-version-gates';

testGateReact19_2('renders Activity hidden and then visible', async () => {
  await render(
    <React.Activity mode="hidden">
      <View testID="activity-target">
        <Text>Ready</Text>
      </View>
    </React.Activity>,
  );

  expect(screen.queryByTestId('activity-target')).not.toBeOnTheScreen();
  expect(
    screen.getByTestId('activity-target', { includeHiddenElements: true }).props.style,
  ).toEqual({
    display: 'none',
  });
  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <View
      style={
        {
          "display": "none",
        }
      }
      testID="activity-target"
    >
      <Text>
        Ready
      </Text>
    </View>
  `);

  await screen.rerender(
    <React.Activity mode="visible">
      <View testID="activity-target">
        <Text>Ready</Text>
      </View>
    </React.Activity>,
  );

  expect(screen.getByTestId('activity-target')).toBeOnTheScreen();
  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="activity-target"
    >
      <Text>
        Ready
      </Text>
    </View>
  `);
});
