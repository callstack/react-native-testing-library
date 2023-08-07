import * as React from 'react';
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

const itemsAmount = 20; // Change this value to shrink/extend scroll length

const DATA: ItemData[] = [];

for (let i = 1; i <= itemsAmount; i++) {
  const item = {
    id: `${i}`,
    title: `Item ${i}`,
  };
  DATA.push(item);
}

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
  const handleOnContentSizeChange = (w: number, h: number) => {
    console.log(`Event: contentSizeChange`, w, h);
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    return <Item item={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onContentSizeChange={handleOnContentSizeChange}
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
