import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { Experiment, experiments } from './experiments';

export function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={experiments} renderItem={renderItem} />
    </SafeAreaView>
  );
}

function renderItem({ item }: ListRenderItem<Experiment>) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
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
