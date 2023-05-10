import * as React from 'react';
import { Text } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render } from '../../..';
import { userEvent } from '../..';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('user.press()', () => {
  it('dispatches required events on Text', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const screen = render(
      <Text
        testID="view"
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );

    await user.press(screen.getByTestId('view'));

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['pressIn', 'press', 'pressOut']);
    expect(events).toMatchSnapshot();
  });

  it('supports direct access', async () => {
    const { events, logEvent } = createEventLogger();
    const screen = render(
      <Text
        testID="view"
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );

    await userEvent.press(screen.getByTestId('view'));

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['pressIn', 'press', 'pressOut']);
  });

  it.each(['modern', 'legacy'])('works with fake %s timers', async (type) => {
    jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });

    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const screen = render(
      <Text
        testID="view"
        onPress={logEvent('press')}
        onPressIn={logEvent('pressIn')}
        onPressOut={logEvent('pressOut')}
      />
    );

    await user.press(screen.getByTestId('view'));

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['pressIn', 'press', 'pressOut']);
  });
});
