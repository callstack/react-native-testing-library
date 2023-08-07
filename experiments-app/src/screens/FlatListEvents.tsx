import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { buildEventLogger } from '../utils/helpers';

type ItemData = {
  id: string;
  title: string;
};

type ItemProps = {
  item: ItemData;
};

const DATA: ItemData[] = [
  {
    id: '0',
    title: 'First Item',
  },
  {
    id: '1',
    title: 'Second Item',
  },
  {
    id: '2',
    title: 'Third Item',
  },
  {
    id: '3',
    title: 'Fourth Item',
  },
  {
    id: '4',
    title: 'Fifth Item',
  },
  {
    id: '5',
    title: 'Sixth Item',
  },
  {
    id: '6',
    title: 'Seventh Item',
  },
  {
    id: '7',
    title: 'Eighth Item',
  },
  {
    id: '8',
    title: 'Ninth Item',
  },
  {
    id: '9',
    title: 'Tenth Item',
  },
  {
    id: '10',
    title: 'Eleventh Item',
  },
];

const Item = ({ item }: ItemProps) => (
  <View style={[styles.item]}>
    <Text style={[styles.title]}>{item.title}</Text>
  </View>
);

const handleOnMomentumScrollBegin = buildEventLogger('onMomentumScrollBegin');
const handleOnMomentumScrollEnd = buildEventLogger('onMomentumScrollEnd');
const handleOnScroll = buildEventLogger('onScroll');
const handleOnScrollBeginDrag = buildEventLogger('onScrollBeginDrag');
const handleOnScrollEndDrag = buildEventLogger('onScrollEndDrag');
const handleOnScrollToTop = buildEventLogger('onScrollToTop');

export function FlatListEvents() {
  const renderItem = ({ item }: { item: ItemData }) => {
    return <Item item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onMomentumScrollBegin={handleOnMomentumScrollBegin}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        onScroll={handleOnScroll}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onScrollEndDrag={handleOnScrollEndDrag}
        onScrollToTop={handleOnScrollToTop}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: 'pink',
  },
  title: {
    fontSize: 32,
  },
});
