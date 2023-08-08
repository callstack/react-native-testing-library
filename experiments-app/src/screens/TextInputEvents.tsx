import * as React from 'react';
import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { nativeEventLogger, logEvent } from '../utils/helpers';

export function TextInputEvents() {
  const [value, setValue] = React.useState('');

  const handleChangeText = (value: string) => {
    setValue(value);
    logEvent('changeText', value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={value}
        editable={true}
        onChangeText={handleChangeText}
        onChange={nativeEventLogger('change')}
        onKeyPress={nativeEventLogger('keyPress')}
        onEndEditing={nativeEventLogger('endEditing')}
        onSubmitEditing={nativeEventLogger('submitEditing')}
        onTextInput={nativeEventLogger('textInput')}
        onSelectionChange={nativeEventLogger('selectionChange')}
        onContentSizeChange={nativeEventLogger('contentSizeChange')}
        onFocus={nativeEventLogger('focus')}
        onBlur={nativeEventLogger('blur')}
        onPressIn={nativeEventLogger('pressIn')}
        onPressOut={nativeEventLogger('pressOut')}
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
