import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';

describe('userEvent.scroll with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('calls events', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();

    render(
      <ScrollView
        onScroll={logEvent('scroll')}
        onScrollBeginDrag={logEvent('scrollBeginDrag')}
        onScrollEndDrag={logEvent('scrollEndDrag')}
        onMomentumScrollBegin={logEvent('momentumScrollBegin')}
        onMomentumScrollEnd={logEvent('momentumScrollEnd')}
        onScrollToTop={logEvent('scrollToTop')}
        testID="scrollable"
      >
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida
          neque convallis a cras semper auctor neque. Ultrices in iaculis nunc
          sed augue lacus. Vulputate ut pharetra sit amet aliquam id. Eget sit
          amet tellus cras adipiscing enim. Velit aliquet sagittis id
          consectetur purus ut faucibus pulvinar.
        </Text>
        <Text>
          Eget gravida cum sociis natoque penatibus. Nunc sed blandit libero
          volutpat sed cras. Aliquet bibendum enim facilisis gravida neque
          convallis a cras. Euismod nisi porta lorem mollis aliquam. Consequat
          mauris nunc congue nisi vitae suscipit tellus. Mauris pellentesque
          pulvinar pellentesque habitant morbi tristique. Nulla aliquet enim
          tortor at auctor.
        </Text>
        <Text>
          A condimentum vitae sapien pellentesque. Quis eleifend quam adipiscing
          vitae. Elit ut aliquam purus sit amet luctus venenatis. Id faucibus
          nisl tincidunt eget nullam non nisi est. Nunc non blandit massa enim
          nec dui nunc. Urna nec tincidunt praesent semper feugiat nibh.
          Malesuada fames ac turpis egestas maecenas. Viverra nibh cras pulvinar
          mattis nunc sed blandit.
        </Text>
        <Text>
          Molestie nunc non blandit massa enim nec dui nunc. Velit laoreet id
          donec ultrices tincidunt arcu. Imperdiet nulla malesuada pellentesque
          elit eget. Id neque aliquam vestibulum morbi blandit cursus. Ut
          tristique et egestas quis. Nisl nunc mi ipsum faucibus vitae aliquet
          nec ullamcorper sit. Cursus mattis molestie a iaculis at erat.
        </Text>
        <Text>
          Tincidunt arcu non sodales neque sodales ut etiam. Ultrices dui sapien
          eget mi proin sed. Metus vulputate eu scelerisque felis. In
          pellentesque massa placerat duis ultricies lacus sed turpis. Id leo in
          vitae turpis massa sed elementum.
        </Text>
      </ScrollView>
    );

    await user.scroll(screen.getByTestId('scrollable'));

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "name": "scrollBeginDrag",
          "payload": {
            "currentTarget": {
              "measure": [MockFunction],
            },
            "nativeEvent": {
              "changedTouches": [],
              "identifier": 0,
              "locationX": 0,
              "locationY": 0,
              "pageX": 0,
              "pageY": 0,
              "target": 0,
              "timestamp": 0,
              "touches": [],
            },
            "persist": [MockFunction],
          },
        },
        {
          "name": "scroll",
          "payload": {
            "currentTarget": {
              "measure": [MockFunction],
            },
            "nativeEvent": {
              "changedTouches": [],
              "identifier": 0,
              "locationX": 0,
              "locationY": 0,
              "pageX": 0,
              "pageY": 0,
              "target": 0,
              "timestamp": 0,
              "touches": [],
            },
            "persist": [MockFunction],
          },
        },
        {
          "name": "scrollEndDrag",
          "payload": {
            "currentTarget": {
              "measure": [MockFunction],
            },
            "nativeEvent": {
              "changedTouches": [],
              "identifier": 0,
              "locationX": 0,
              "locationY": 0,
              "pageX": 0,
              "pageY": 0,
              "target": 0,
              "timestamp": 0,
              "touches": [],
            },
            "persist": [MockFunction],
          },
        },
      ]
    `);
  });
});
