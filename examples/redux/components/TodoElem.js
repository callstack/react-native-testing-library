import * as React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';

export default function TodoElem({ todo, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{todo.text}</Text>
        <Text style={styles.date}>{new Date(todo.date).toDateString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={() => onDelete(todo.id)} title="Delete" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
