import React from 'react';
import { requireNativeComponent, View, StyleSheet } from 'react-native';

const PureButton = requireNativeComponent('PureButton');

export default function App() {
  const handlePress = () => {
    // Handle the press here
  };

  return (
    <View>
      <PureButton
        style={styles.button}
        title="Hello world"
        accessibilityHint="Test element"
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 500,
  },
});
