import * as React from 'react';
import { TextInput } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render } from '../../..';
import { userEvent } from '../..';

describe('user.type()', () => {
  it('dispatches required events', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const screen = render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onFocus={logEvent('focus')}
        onBlur={logEvent('blur')}
      />
    );

    await user.type(screen.getByTestId('input'), 'Hello World!');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['focus', 'changeText', 'blur']);
    expect(events).toMatchSnapshot();
  });

  it('supports direct access', async () => {
    const { events, logEvent } = createEventLogger();
    const screen = render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onFocus={logEvent('focus')}
        onBlur={logEvent('blur')}
      />
    );

    await userEvent.type(screen.getByTestId('input'), 'Hello World!');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['focus', 'changeText', 'blur']);
  });

  it.each(['modern', 'legacy'])('works with fake %s timers', async (type) => {
    jest.useFakeTimers({ legacyFakeTimers: type === 'legacy' });

    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const screen = render(
      <TextInput
        testID="input"
        onChangeText={logEvent('changeText')}
        onFocus={logEvent('focus')}
        onBlur={logEvent('blur')}
      />
    );

    await user.type(screen.getByTestId('input'), 'Hello World!');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['focus', 'changeText', 'blur']);
  });
});
