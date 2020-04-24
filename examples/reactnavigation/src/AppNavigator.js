import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

const { Screen, Navigator } = createStackNavigator();

export default function Navigation() {
  const options = {};

  return (
    <Navigator>
      <Screen name="Home" component={HomeScreen} />
      <Screen options={options} name="Details" component={DetailsScreen} />
    </Navigator>
  );
}
