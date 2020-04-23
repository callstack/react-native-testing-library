import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Navigation from './Navigation';

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Navigation />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
