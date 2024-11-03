import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { nativeEventLogger, logEvent } from '../utils/helpers';

export function PressEvents() {
  const [value, setValue] = React.useState('');

  const handleChangeText = (value: string) => {
    setValue(value);
    logEvent('changeText', value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onPress={nativeEventLogger('press')}
          onPressIn={nativeEventLogger('pressIn')}
          onPressOut={nativeEventLogger('pressOut')}
        />
      </View>
      <View style={styles.wrapper}>
        <Text
          onPress={nativeEventLogger('press')}
          onLongPress={nativeEventLogger('longPress')}
          onPressIn={nativeEventLogger('pressIn')}
          onPressOut={nativeEventLogger('pressOut')}
        >
          Text
        </Text>
      </View>
      <View style={styles.wrapper}>
        <Pressable
          onPress={nativeEventLogger('press')}
          onLongPress={nativeEventLogger('longPress')}
          onPressIn={nativeEventLogger('pressIn')}
          onPressOut={nativeEventLogger('pressOut')}
        >
          <Text>Pressable</Text>
        </Pressable>
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={nativeEventLogger('press')}
          onLongPress={nativeEventLogger('longPress')}
          onPressIn={nativeEventLogger('pressIn')}
          onPressOut={nativeEventLogger('pressOut')}
        >
          <Text>Pressable</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 20,
    backgroundColor: 'yellow',
  },
  textInput: {
    backgroundColor: 'white',
    margin: 20,
    padding: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'grey',
  },
});
