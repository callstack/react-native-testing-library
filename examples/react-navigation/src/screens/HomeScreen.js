import * as React from 'react';
import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native';

const items = new Array(20).fill(null).map((_, idx) => ({
  id: idx + 1,
  title: `Item ${idx + 1}`,
  value: idx + 1,
}));

export default function HomeScreen({ navigation }) {
  const handleItemPress = (item) => navigation.navigate('Details', item);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => handleItemPress(item)} style={styles.row}>
        <Text>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Text accessibilityRole="header" style={styles.header}>
        Home screen
      </Text>

      <FlatList data={items} renderItem={renderItem} />
    </View>
  );
}

const divider = '#DDDDDD';

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomColor: divider,
    borderBottomWidth: 1,
  },
});
