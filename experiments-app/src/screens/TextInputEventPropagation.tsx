import * as React from 'react';
import { StyleSheet, SafeAreaView, TextInput, Pressable } from 'react-native';
import { nativeEventLogger } from '../utils/helpers';

export function TextInputEventPropagation() {
  const [value, setValue] = React.useState('');

  const handleChangeText = (value: string) => {
    setValue(value);
    console.log(`Event: changeText`, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={nativeEventLogger('Pressable.press')}>
        <TextInput
          style={styles.textInput}
          value={value}
          editable={true}
          onChangeText={handleChangeText}
          onChange={nativeEventLogger('TextInput.change')}
          onPressIn={nativeEventLogger('TextInput.pressIn')}
          onPressOut={nativeEventLogger('TextInput.pressOut')}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
