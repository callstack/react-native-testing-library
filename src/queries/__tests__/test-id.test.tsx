import * as React from 'react';
import { Text, View } from 'react-native';

import { render } from '../..';

it('finds elements by testID using partial matching when exact option is false', async () => {
  const Component = () => (
    <View>
      <View testID="user-profile-card">
        <Text>User Profile</Text>
      </View>
      <View testID="user-settings-card">
        <Text>Settings</Text>
      </View>
    </View>
  );

  const { getByTestId } = await render(<Component />);

  // Users commonly use exact: false to find elements by partial testID matches
  // This is critical for testing components with dynamic or prefixed testIDs
  const profileCard = getByTestId('profile', { exact: false });
  expect(profileCard).toBeOnTheScreen();
  expect(profileCard.props.testID).toBe('user-profile-card');
});
