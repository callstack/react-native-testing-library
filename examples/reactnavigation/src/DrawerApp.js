import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import DrawerAppNavigator from './DrawerAppNavigator';

export default function DrawerApp() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <DrawerAppNavigator />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
