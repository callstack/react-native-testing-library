import { ReactTestInstance } from 'react-test-renderer';
import { EventBuilder } from '../event-builder';
import { UserEventInstance } from '../setup';
import { wait } from '../utils';
import act from '../../act';
import { getHostParent } from '../../helpers/component-tree';
import { filterNodeByType } from '../../helpers/filterNodeByType';
import { isPointerEventEnabled } from '../../helpers/isPointerEventEnabled';
import { getHostComponentNames } from '../../helpers/host-component-names';
import { jestFakeTimersAreEnabled } from '../../helpers/timers';
import { DEFAULT_MIN_PRESS_DURATION } from './constants';
import { warnAboutRealTimers } from './utils/warnAboutRealTimers';

export type PressOptions = {
  pressDuration: number;
};

export async function press(
  this: UserEventInstance,
  element: ReactTestInstance
): Promise<void> {
  await basePress(this.config, element);
}

export async function longPress(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 500 }
): Promise<void> {
  await basePress(this.config, element, options);
}

const basePress = async (
  config: UserEventInstance['config'],
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
): Promise<void> => {
  // Text and TextInput components are mocked in React Native preset so the mock
  // doesn't implement the pressability class
  // Thus we need to call the props directly on the host component
  const isEnabledHostText =
    filterNodeByType(element, getHostComponentNames().text) &&
    !element.props.disabled;
  const isEnabledTextInput =
    filterNodeByType(element, getHostComponentNames().textInput) &&
    element.props.editable !== false;

  if (isEnabledHostText || isEnabledTextInput) {
    const { onPressIn, onPress, onPressOut } = element.props;
    await wait(config);
    if (onPressIn) {
      onPressIn(EventBuilder.Common.press());
    }
    if (onPress) {
      onPress(EventBuilder.Common.press());
    }
    await wait(config, options.pressDuration);
    if (onPressOut) {
      if (DEFAULT_MIN_PRESS_DURATION - options.pressDuration > 0) {
        await wait(config, DEFAULT_MIN_PRESS_DURATION - options.pressDuration);
      }
      onPressOut(EventBuilder.Common.press());
    }
  }

  if (isEnabledTouchResponder(element)) {
    await triggerPressEvent(config, element, options);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  await basePress(config, hostParentElement, options);
};

const triggerPressEvent = async (
  config: UserEventInstance['config'],
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
) => {
  const areFakeTimersEnabled = jestFakeTimersAreEnabled();
  if (!areFakeTimersEnabled) {
    warnAboutRealTimers();
  }

  await wait(config);

  await act(async () => {
    element.props.onResponderGrant({
      ...EventBuilder.Common.press(),
      dispatchConfig: { registrationName: 'onResponderGrant' },
    });

    await wait(config, options.pressDuration);

    element.props.onResponderRelease({
      ...EventBuilder.Common.press(),
      dispatchConfig: { registrationName: 'onResponderRelease' },
    });

    if (DEFAULT_MIN_PRESS_DURATION - options.pressDuration > 0) {
      await wait(config, DEFAULT_MIN_PRESS_DURATION - options.pressDuration);
    }
  });
};

const isEnabledTouchResponder = (element: ReactTestInstance) => {
  return (
    isPointerEventEnabled(element) &&
    element.props.onStartShouldSetResponder &&
    element.props.onStartShouldSetResponder()
  );
};
