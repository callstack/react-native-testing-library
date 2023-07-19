import * as React from 'react';
import { Text } from 'react-native';
import render from '../../../render';
import { dispatchEvent } from '../dispatch-event';
import { EventBuilder } from '../../event-builder';

const TOUCH_EVENT = EventBuilder.Common.touch();

describe('dispatchEvent', () => {
  it('does dispatch event', () => {
    const onPress = jest.fn();
    const screen = render(<Text testID="text" onPress={onPress} />);

    dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch event to parent host component', () => {
    const onPressParent = jest.fn();
    const screen = render(
      <Text onPress={onPressParent}>
        <Text testID="text" />
      </Text>
    );

    dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPressParent).not.toHaveBeenCalled();
  });

  it('does NOT throw if no handler found', () => {
    const screen = render(
      <Text>
        <Text testID="text" />
      </Text>
    );

    expect(() =>
      dispatchEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT)
    ).not.toThrow();
  });
});
