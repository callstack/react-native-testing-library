import * as React from 'react';
import { Text } from 'react-native';
import { createEventToolkit } from '../../../test-utils/events';
import { render } from '../../..';
import { userEvent } from '../..';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('user.press()', () => {
  it('should dispatches required events on Text', async () => {
    // Required for touch events which contain timestamp
    jest.spyOn(Date, 'now').mockReturnValue(100100100100);

    const { events, handleEvent } = createEventToolkit();
    const screen = render(
      <Text
        testID="view"
        onPress={handleEvent('press')}
        onPressIn={handleEvent('pressIn')}
        onPressOut={handleEvent('pressOut')}
      />
    );

    const user = userEvent.setup();
    await user.press(screen.getByTestId('view'));

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['pressIn', 'press', 'pressOut']);
    expect(events).toMatchSnapshot();
  });
});
