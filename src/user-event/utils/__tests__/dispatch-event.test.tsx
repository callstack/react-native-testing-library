import * as React from 'react';
import { Text } from 'react-native';

import { render, screen } from '../../..';
import { EventBuilder } from '../../event-builder';
import { dispatchEvent } from '../dispatch-event';

const TOUCH_EVENT = EventBuilder.Common.touch();

describe('dispatchEvent', () => {
  it('does dispatch event', async () => {
    const onPress = jest.fn();
    render(<Text testID="text" onPress={onPress} />);

    await dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch event to parent host component', async () => {
    const onPressParent = jest.fn();
    render(
      <Text onPress={onPressParent}>
        <Text testID="text" />
      </Text>,
    );

    await dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPressParent).not.toHaveBeenCalled();
  });

  it('does NOT throw if no handler found', async () => {
    render(
      <Text>
        <Text testID="text" />
      </Text>,
    );

    await expect(
      dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT),
    ).resolves.not.toThrow();
  });
});
