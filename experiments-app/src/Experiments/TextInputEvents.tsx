import * as React from 'react';
import { StyleSheet, SafeAreaView, View, TextInput } from 'react-native';
import { buildEventLogger } from './helpers';

const handlePressIn = buildEventLogger('pressIn');
const handlePressOut = buildEventLogger('pressOut');
const handleFocus = buildEventLogger('focus');
const handleBlur = buildEventLogger('blur');
const handleChange = buildEventLogger('change');

export function TextInputEvents() {
  const [value, setValue] = React.useState('Test');

  const handleChangeText = (value: string) => {
    setValue(value);
    console.log(`Event: changeText`, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={value}
        editable={false}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onChangeText={handleChangeText}
      />
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
