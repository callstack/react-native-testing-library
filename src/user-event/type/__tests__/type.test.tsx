import * as React from 'react';
import { TextInput } from 'react-native';
import { createEventLogger } from '../../../test-utils';
import { render } from '../../..';
import { userEvent } from '../..';

describe('user.type()', () => {
  it('should dispatches required events', async () => {
    const { events, logEvent } = createEventLogger();
    const user = userEvent.setup();
    const screen = render(
      <TextInput testID="input" onChangeText={logEvent('changeText')} />
    );

    await user.type(screen.getByTestId('input'), 'Hello World!');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['changeText']);
    expect(events).toMatchSnapshot();
  });
});
