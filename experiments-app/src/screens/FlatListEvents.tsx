import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { buildEventLogger } from '../utils/helpers';

interface ItemData {
  id: string;
  title: string;
}

const data: ItemData[] = [...new Array(25)].map((_, index) => ({
  id: `${index + 1}`,
  title: `Item ${index + 1}`,
}));

const handleMomentumScrollBegin = buildEventLogger('momentumScrollBegin');
const handleMomentumScrollEnd = buildEventLogger('momentumScrollEnd');
const handleScroll = buildEventLogger('scroll');
const handleScrollBeginDrag = buildEventLogger('scrollBeginDrag');
const handleScrollEndDrag = buildEventLogger('scrollEndDrag');
const handleScrollToTop = buildEventLogger('scrollToTop');

export function FlatListEvents() {
  const handleContentSizeChange = (w: number, h: number) => {
    console.log(`Event: contentSizeChange`, w, h);
  };

  const handleEndReached = (info: { distanceFromEnd: number }) => {
    console.log(`Event: endReached`, info.distanceFromEnd);
  };

  const renderItem = ({ item }: { item: ItemData }) => {
    return <Item item={item} />;
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="scrollableAxes"
      scrollEventThrottle={150}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onContentSizeChange={handleContentSizeChange}
      onMomentumScrollBegin={handleMomentumScrollBegin}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onScrollToTop={handleScrollToTop}
      onEndReached={handleEndReached}
    />
  );
}

interface ItemProps {
  item: ItemData;
}

const Item = ({ item }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
  },
});
