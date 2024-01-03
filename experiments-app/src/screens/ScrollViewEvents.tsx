import * as React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { customEventLogger, nativeEventLogger } from '../utils/helpers';

export function ScrollViewEvents() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="scrollableAxes"
      scrollEventThrottle={150}
      onScroll={nativeEventLogger('scroll')}
      onScrollBeginDrag={nativeEventLogger('scrollBeginDrag')}
      onScrollEndDrag={nativeEventLogger('scrollEndDrag')}
      onMomentumScrollBegin={nativeEventLogger('momentumScrollBegin')}
      onMomentumScrollEnd={nativeEventLogger('momentumScrollEnd')}
      onScrollToTop={nativeEventLogger('scrollToTop')}
      onContentSizeChange={customEventLogger('contentSizeChange')}
    >
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Gravida neque convallis a cras semper auctor neque. Ultrices
        in iaculis nunc sed augue lacus. Vulputate ut pharetra sit amet aliquam id. Eget sit amet
        tellus cras adipiscing enim. Velit aliquet sagittis id consectetur purus ut faucibus
        pulvinar.
      </Text>
      <Text style={styles.text}>
        Eget gravida cum sociis natoque penatibus. Nunc sed blandit libero volutpat sed cras.
        Aliquet bibendum enim facilisis gravida neque convallis a cras. Euismod nisi porta lorem
        mollis aliquam. Consequat mauris nunc congue nisi vitae suscipit tellus. Mauris pellentesque
        pulvinar pellentesque habitant morbi tristique. Nulla aliquet enim tortor at auctor.
      </Text>
      <Text style={styles.text}>
        A condimentum vitae sapien pellentesque. Quis eleifend quam adipiscing vitae. Elit ut
        aliquam purus sit amet luctus venenatis. Id faucibus nisl tincidunt eget nullam non nisi
        est. Nunc non blandit massa enim nec dui nunc. Urna nec tincidunt praesent semper feugiat
        nibh. Malesuada fames ac turpis egestas maecenas. Viverra nibh cras pulvinar mattis nunc sed
        blandit.
      </Text>
      <Text style={styles.text}>
        Molestie nunc non blandit massa enim nec dui nunc. Velit laoreet id donec ultrices tincidunt
        arcu. Imperdiet nulla malesuada pellentesque elit eget. Id neque aliquam vestibulum morbi
        blandit cursus. Ut tristique et egestas quis. Nisl nunc mi ipsum faucibus vitae aliquet nec
        ullamcorper sit. Cursus mattis molestie a iaculis at erat.
      </Text>
      <Text style={styles.text}>
        Tincidunt arcu non sodales neque sodales ut etiam. Ultrices dui sapien eget mi proin sed.
        Metus vulputate eu scelerisque felis. In pellentesque massa placerat duis ultricies lacus
        sed turpis. Id leo in vitae turpis massa sed elementum.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 20,
    paddingTop: 20,
    fontSize: 24,
  },
});
