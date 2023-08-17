import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';

describe('userEvent.scroll with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('does NOT work if starting position is x:0, y:0', async () => {
    render(<ScrollView testID="scrollable" />);

    const user = userEvent.setup();
    await expect(
      user.scrollToTop(screen.getByTestId('scrollable'))
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollToTop() does NOT trigger if content offset is already x:0, y:0."`
    );
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

    await user.scrollTo(screen.getByTestId('scrollable'), { y: 20 });
    await user.scrollToTop(screen.getByTestId('scrollable'));

    expect(events).toMatchSnapshot('scrollTo({ y: 20 }) + scrollToTop()');
  });

  it('does NOT work on View', async () => {
    const screen = render(<View testID="view" />);

    const user = userEvent.setup();
    await expect(
      user.scrollToTop(screen.getByTestId('view'))
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollToTop() works only with host "ScrollView" elements. Passed element has type "View"."`
    );
  });

  test('scrollToTop is accessible directly in userEvent', async () => {
    const mockOnScrollToTop = jest.fn();

    render(
      <ScrollView onScrollToTop={mockOnScrollToTop} testID="scrollable" />
    );

    await userEvent.scrollTo(screen.getByTestId('scrollable'), { y: 20 });
    await userEvent.scrollToTop(screen.getByTestId('scrollable'));
    expect(mockOnScrollToTop).toHaveBeenCalled();
  });
});
