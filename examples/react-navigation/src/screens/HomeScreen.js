import * as React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';

const mockData = new Array(20).fill(null).map((_, index) => ({
  id: index + 1,
  title: `Item ${index + 1}`,
  value: index + 1,
}));

export default function HomeScreen({ navigation }) {
  const handleItemPress = (item) => navigation.navigate('Details', item);

  const renderItem = ({ item }) => {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleItemPress(item)}
        style={styles.row}
      >
        <Text>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Home screen
      </Text>

      <FlatList data={mockData} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
});
