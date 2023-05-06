import * as React from 'react';
import { TextInput } from 'react-native';
import { createEventToolkit } from '../../../test-utils/events';
import { render } from '../../..';
import { userEvent } from '../..';

describe('user.type()', () => {
  it('should dispatches required events', async () => {
    const { events, handleEvent } = createEventToolkit();
    const screen = render(
      <TextInput testID="input" onChangeText={handleEvent('changeText')} />
    );

    const user = userEvent.setup();
    await user.type(screen.getByTestId('input'), 'Hello World!');

    const eventNames = events.map((event) => event.name);
    expect(eventNames).toEqual(['changeText']);
    expect(events).toMatchSnapshot();
  });
});
