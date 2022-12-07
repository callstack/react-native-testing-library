import * as React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen({ route }) {
  const item = route.params;

  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Details for {item.title}
      </Text>
      <Text style={styles.body}>
        The number you have chosen is {item.value}.
      </Text>

      <BackButton />
    </View>
  );
}

function BackButton() {
  const navigation = useNavigation();

  return (
    <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
      <Text>Go Back</Text>
    </Pressable>
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
