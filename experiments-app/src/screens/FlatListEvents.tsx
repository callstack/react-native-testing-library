import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { customEventLogger, nativeEventLogger } from '../utils/helpers';

interface ItemData {
  id: string;
  title: string;
}

const data: ItemData[] = [...new Array(25)].map((_, index) => ({
  id: `${index + 1}`,
  title: `Item ${index + 1}`,
}));

export function FlatListEvents() {
  const renderItem = ({ item }: { item: ItemData }) => {
    return <Item item={item} />;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="scrollableAxes"
      scrollEventThrottle={150}
      onScroll={nativeEventLogger('scroll')}
      onScrollBeginDrag={nativeEventLogger('scrollBeginDrag')}
      onScrollEndDrag={nativeEventLogger('scrollEndDrag')}
      onMomentumScrollBegin={nativeEventLogger('momentumScrollBegin')}
      onMomentumScrollEnd={nativeEventLogger('momentumScrollEnd')}
      onScrollToTop={nativeEventLogger('scrollToTop')}
      onEndReached={customEventLogger('endReached')}
      onContentSizeChange={customEventLogger('contentSizeChange')}
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
