import * as React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [items] = React.useState(
    new Array(20).fill(null).map((_, idx) => idx + 1)
  );

  const onOpacityPress = (item) => navigation.navigate('Details', item);

  return (
    <View>
      <Text style={styles.header}>List of numbers from 1 to 20</Text>
      <FlatList
        keyExtractor={(_, idx) => `${idx}`}
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onOpacityPress(item)}
            style={styles.row}
          >
            <Text>Item number {item}</Text>
          </TouchableOpacity>
        )}
      />
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
