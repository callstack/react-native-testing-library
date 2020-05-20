import React from 'react';
import { View, Button } from 'react-native';
import NativeNotification from './NativeNotification';

export default function PureNativeModule() {
  const showNotification = () => {
    const title = 'Custom notification';
    const message = `Custom notification shown at ${new Date().toISOString()}`;
    NativeNotification.show(title, message);
  };

  return (
    <View>
      <Button title="Click to show notification" onPress={showNotification} />
    </View>
  );
}
