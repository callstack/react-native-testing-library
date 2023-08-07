import * as React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { buildEventLogger } from '../utils/helpers';

const handleOnMomentumScrollBegin = buildEventLogger('onMomentumScrollBegin');
const handleOnMomentumScrollEnd = buildEventLogger('onMomentumScrollEnd');
const handleOnScroll = buildEventLogger('onScroll');
const handleOnScrollBeginDrag = buildEventLogger('onScrollBeginDrag');
const handleOnScrollEndDrag = buildEventLogger('onScrollEndDrag');
const handleOnScrollToTop = buildEventLogger('onScrollToTop');

export function ScrollViewEvents() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        onMomentumScrollBegin={handleOnMomentumScrollBegin}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        onScroll={handleOnScroll}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onScrollEndDrag={handleOnScrollEndDrag}
        onScrollToTop={handleOnScrollToTop}
      >
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida
          neque convallis a cras semper auctor neque. Ultrices in iaculis nunc
          sed augue lacus. Vulputate ut pharetra sit amet aliquam id. Eget sit
          amet tellus cras adipiscing enim. Velit aliquet sagittis id
          consectetur purus ut faucibus pulvinar. Eget gravida cum sociis
          natoque penatibus. Nunc sed blandit libero volutpat sed cras. Aliquet
          bibendum enim facilisis gravida neque convallis a cras. Euismod nisi
          porta lorem mollis aliquam. Consequat mauris nunc congue nisi vitae
          suscipit tellus. Mauris pellentesque pulvinar pellentesque habitant
          morbi tristique. Nulla aliquet enim tortor at auctor. A condimentum
          vitae sapien pellentesque. Quis eleifend quam adipiscing vitae. Elit
          ut aliquam purus sit amet luctus venenatis. Id faucibus nisl tincidunt
          eget nullam non nisi est. Nunc non blandit massa enim nec dui nunc.
          Urna nec tincidunt praesent semper feugiat nibh. Malesuada fames ac
          turpis egestas maecenas. Viverra nibh cras pulvinar mattis nunc sed
          blandit. Molestie nunc non blandit massa enim nec dui nunc. Velit
          laoreet id donec ultrices tincidunt arcu. Imperdiet nulla malesuada
          pellentesque elit eget. Id neque aliquam vestibulum morbi blandit
          cursus. Ut tristique et egestas quis. Nisl nunc mi ipsum faucibus
          vitae aliquet nec ullamcorper sit. Cursus mattis molestie a iaculis at
          erat. Tincidunt arcu non sodales neque sodales ut etiam. Ultrices dui
          sapien eget mi proin sed. Metus vulputate eu scelerisque felis. In
          pellentesque massa placerat duis ultricies lacus sed turpis. Id leo in
          vitae turpis massa sed elementum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
