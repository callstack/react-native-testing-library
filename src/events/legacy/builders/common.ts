import { buildTouchNativeEvent } from '../../shared/payloads';
import { wrapNativeEvent } from './base';

export function buildTouchEvent() {
  return {
    ...wrapNativeEvent(buildTouchNativeEvent()),
    currentTarget: { measure: () => {} },
  };
}

export function buildResponderGrantEvent() {
  return {
    ...buildTouchEvent(),
    dispatchConfig: { registrationName: 'onResponderGrant' },
  };
}

export function buildResponderReleaseEvent() {
  return {
    ...buildTouchEvent(),
    dispatchConfig: { registrationName: 'onResponderRelease' },
  };
}
