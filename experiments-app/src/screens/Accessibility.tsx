import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';

export function AccessibilityScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.view}>
        <Text accessible={false}>{'<View />'}</Text>
      </View>
      <View accessible style={styles.view}>
        <Text accessible={false}>{'<View accessible />'}</Text>
      </View>
      <View role="button" style={styles.view}>
        <Text accessible={false}>{'<View role="button" />'}</Text>
      </View>
      <View accessible role="button" style={styles.view}>
        <Text accessible={false}>{'<View accessible role="button" />'}</Text>
      </View>
      <View accessible role="slider" style={styles.view}>
        <Text accessible={false}>{'<View accessible role="slider" />'}</Text>
      </View>
      <View accessible role="none" style={styles.view}>
        <Text accessible={false}>{'<View accessible role="none" />'}</Text>
      </View>

      <Text style={styles.text}>{'<Text />'}</Text>
      <Text accessible={false} style={styles.text}>
        {'<Text accessible={false} />'}
      </Text>
      <Text role="none" style={styles.text}>
        {'<Text role="none" />'}
      </Text>

      <TextInput style={styles.textInput} value="<TextInput />" />
      <TextInput editable={false} style={styles.textInput} value="<TextInput editable={false} />" />
      <TextInput
        accessibilityRole="search"
        style={styles.textInput}
        value="<TextInput accessibilityRole='search' />"
      />
      <TextInput role="searchbox" style={styles.textInput} value="<TextInput role='search' />" />
      <TextInput role="none" style={styles.textInput} value="<TextInput role='none' />" />
      <TextInput
        accessible={false}
        style={styles.textInput}
        value="<TextInput accessible={false} />"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    padding: 20,
    backgroundColor: 'grey',
  },
  text: {
    padding: 20,
    backgroundColor: '#b1f2ff',
  },
  textInput: {
    padding: 20,
    backgroundColor: '#fbebd8',
  },
});
