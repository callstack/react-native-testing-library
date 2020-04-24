import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default function DetailsScreen(props) {
  const item = Number.parseInt(props.route.params, 10);

  return (
    <View>
      <Text style={styles.header}>Showing details for {item}</Text>
      <Text style={styles.body}>the number you have chosen is {item}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  body: {
    textAlign: 'center',
  },
});
