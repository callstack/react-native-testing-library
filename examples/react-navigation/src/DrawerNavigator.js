import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerHomeScreen from './screens/DrawerHomeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function Navigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={DrawerHomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
