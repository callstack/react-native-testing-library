import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';
import { ScrollToOptions } from '../scrollTo';

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
      />
    );

    await user.scrollTo(screen.getByTestId('scrollable'), {
      offset: { x: 0, y: 120 },
    });

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "name": "scrollBeginDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 0,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 30,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 60,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 90,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scrollEndDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 120,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
      ]
    `);
  });

  test('calls events with momentum', async () => {
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
      />
    );

    await user.scrollTo(screen.getByTestId('scrollable'), {
      offset: { x: 0, y: 120 },
      momentum: { value: 30, callbacksNumber: 1 },
    });

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "name": "scrollBeginDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 0,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 30,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 60,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 90,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scrollEndDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 120,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "momentumScrollBegin",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 120,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 135,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "momentumScrollEnd",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 150,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
      ]
    `);
  });

  test('scrolling the same element twice starts from remembered value (top to bottom/bottom to top)', async () => {
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
      />
    );

    await user.scrollTo(screen.getByTestId('scrollable'), {
      offset: { x: 0, y: 120 },
      callbacksNumber: 1,
    });

    await user.scrollTo(screen.getByTestId('scrollable'), {
      offset: { x: 0, y: 20 },
    });

    expect(events).toMatchInlineSnapshot(`
      [
        {
          "name": "scrollBeginDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 0,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 60,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scrollEndDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 120,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scrollBeginDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 120,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 95,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 70,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scroll",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 45,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        {
          "name": "scrollEndDrag",
          "payload": {
            "contentInset": {
              "bottom": 0,
              "left": 0,
              "right": 0,
              "top": 0,
            },
            "contentOffset": {
              "x": 0,
              "y": 20,
            },
            "contentSize": {
              "height": 0,
              "width": 0,
            },
            "layoutMeasurement": {
              "height": 0,
              "width": 0,
            },
            "responderIgnoreScroll": true,
            "target": 0,
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
      ]
    `);
  });

  it('does NOT work on View', async () => {
    const screen = render(<View testID="view" />);

    const user = userEvent.setup();
    await expect(
      user.scrollTo(screen.getByTestId('view'), { offset: { x: 0, y: 20 } })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollTo() works only with host "ScrollView" elements. Passed element has type "View"."`
    );
  });

  test('scrollTo is accessible directly in userEvent', async () => {
    const mockOnScroll = jest.fn();

    render(<ScrollView onScroll={mockOnScroll} testID="scrollable" />);

    const options: ScrollToOptions = {
      offset: {
        y: 90,
      },
    };

    await userEvent.scrollTo(screen.getByTestId('scrollable'), options);
    expect(mockOnScroll).toHaveBeenCalled();
  });
});
