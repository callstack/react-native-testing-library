import * as React from 'react';
import { StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { buildEventLogger } from '../utils/helpers';

const handlePressIn = buildEventLogger('pressIn');
const handlePressOut = buildEventLogger('pressOut');
const handleFocus = buildEventLogger('focus');
const handleBlur = buildEventLogger('blur');
const handleChange = buildEventLogger('change');
const handleEndEditing = buildEventLogger('endEditing');
const handleSubmitEditing = buildEventLogger('submitEditing');
const handleKeyPress = buildEventLogger('keyPress');
const handleTextInput = buildEventLogger('textInput');
const handleSelectionChange = buildEventLogger('selectionChange');
const handleContentSizeChange = buildEventLogger('contentSizeChange');

export function TextInputEvents() {
  const [value, setValue] = React.useState('');

  const handleChangeText = (value: string) => {
    setValue(value);
    console.log(`Event: changeText`, value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={value}
        editable={true}
        onChangeText={handleChangeText}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onEndEditing={handleEndEditing}
        onSubmitEditing={handleSubmitEditing}
        onKeyPress={handleKeyPress}
        onTextInput={handleTextInput}
        onSelectionChange={handleSelectionChange}
        onContentSizeChange={handleContentSizeChange}
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
