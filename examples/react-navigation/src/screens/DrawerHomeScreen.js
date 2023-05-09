import * as React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

export default function DrawerHomeScreen({ navigation }) {
  const handleToggleDrawer = () => navigation.toggleDrawer();

  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Home screen
      </Text>

      <Pressable accessiblityRole="button" onPress={handleToggleDrawer}>
        <Text>Toggle drawer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
});
