import * as React from 'react';
import { View, Text } from 'react-native';

type Props = {
  user: string;
};

export function Home({ user }: Props) {
  return (
    <View>
      <Text>Welcome {user}!</Text>
    </View>
  );
}
