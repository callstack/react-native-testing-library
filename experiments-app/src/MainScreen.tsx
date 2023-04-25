import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Experiment, experiments } from './experiments';

export function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={experiments}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </SafeAreaView>
  );
}

interface ListItemProps {
  item: Experiment;
}

function ListItem({ item }: ListItemProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(item.key);
  };

  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
  },
  itemTitle: {
    fontSize: 20,
  },
});
