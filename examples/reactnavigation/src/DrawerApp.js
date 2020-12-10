import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import DrawerAppNavigator from './DrawerAppNavigator';

export default function DrawerApp() {
  return (
    <NavigationContainer>
      <DrawerAppNavigator />
    </NavigationContainer>
  );
}
