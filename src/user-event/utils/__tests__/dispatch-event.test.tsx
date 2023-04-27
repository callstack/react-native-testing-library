import * as React from 'react';
import { Text } from 'react-native';
import render from '../../../render';
import { dispatchHostEvent, dispatchOwnHostEvent } from '../dispatch-event';
import { EventBuilder } from '../../event-builder';

const TOUCH_EVENT = EventBuilder.Common.touch();

describe('dispatchHostEvent', () => {
  it('does dispatch event', () => {
    const onPress = jest.fn();
    const screen = render(<Text testID="text" onPress={onPress} />);

    dispatchHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does dispatch event to parent host component if not handled', () => {
    const onPressParent = jest.fn();
    const screen = render(
      <Text onPress={onPressParent}>
        <Text testID="text" />
      </Text>
    );

    dispatchHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPressParent).toHaveBeenCalledTimes(1);
  });

  it('does NOT dispatch event to parent host component if handled', () => {
    const onPress = jest.fn();
    const onPressParent = jest.fn();
    const screen = render(
      <Text onPress={onPressParent}>
        <Text testID="text" onPress={onPress} />
      </Text>
    );

    dispatchHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPressParent).not.toHaveBeenCalled();
  });

  it('does NOT throw if no handler found', () => {
    const screen = render(
      <Text>
        <Text testID="text" />
      </Text>
    );

    expect(() =>
      dispatchHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT)
    ).not.toThrow();
  });
});

describe('dispatchOwnHostEvent', () => {
  it('does dispatch event', () => {
    const onPress = jest.fn();
    const screen = render(<Text testID="text" onPress={onPress} />);

    dispatchOwnHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does NOT dispatch event to parent host component', () => {
    const onPressParent = jest.fn();
    const screen = render(
      <Text onPress={onPressParent}>
        <Text testID="text" />
      </Text>
    );

    dispatchOwnHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT);
    expect(onPressParent).not.toHaveBeenCalled();
  });

  it('does NOT throw if no handler found', () => {
    const screen = render(
      <Text>
        <Text testID="text" />
      </Text>
    );

    expect(() =>
      dispatchOwnHostEvent(screen.getByTestId('text'), 'press', TOUCH_EVENT)
    ).not.toThrow();
  });
});
