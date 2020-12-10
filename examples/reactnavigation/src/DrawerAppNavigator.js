import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Button, Text} from 'react-native';

const { Screen, Navigator } = createDrawerNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome!</Text>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the notifications screen</Text>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

export default function Navigation() {
  return (
    <Navigator>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Notifications" component={NotificationsScreen} />
    </Navigator>
  );
}
