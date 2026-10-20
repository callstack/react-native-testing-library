import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { ensureInstanceForEvent } from '../shared/assertions';
import { normalizeEventType } from '../shared/handler';
import { mergeEventProps } from '../shared/merge';
import { getNativeStateEventProps, updateNativeStateFromEvent } from '../shared/native-state';
import { buildLayoutNativeEvent, buildScrollNativeEvent } from '../shared/payloads';
import type { EventProps, EventType, LayoutRectangle } from '../shared/types';
import { wrapNativeEvent } from './builders/base';
import { buildTouchEvent } from './builders/common';
import { findEventHandler } from './propagation';
import { warnAboutUnhandledEvent } from './warnings';

async function fireEvent(instance: TestInstance, eventType: EventType, ...data: unknown[]) {
  ensureInstanceForEvent(instance, normalizeEventType(eventType), fireEvent);
  return await fireEventInternal(instance, { type: eventType, data, bubbles: true });
}

fireEvent.changeText = async (instance: TestInstance, text: string) => {
  ensureInstanceForEvent(instance, 'changeText', fireEvent.changeText);
  return await fireEvent(instance, 'changeText', text);
};

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps) => {
  ensureInstanceForEvent(instance, 'press', fireEvent.press);
  await fireEvent(instance, 'press', mergeEventProps(buildTouchEvent(), eventProps));
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps) => {
  ensureInstanceForEvent(instance, 'scroll', fireEvent.scroll);
  const nativeEvent = mergeEventProps(
    buildScrollNativeEvent(),
    getNativeStateEventProps(instance, 'scroll'),
  );
  await fireEvent(instance, 'scroll', mergeEventProps(wrapNativeEvent(nativeEvent), eventProps));
};

// Does not bubble and checks only the element's own props, as React Native delivers layout events
// only to the measured element. This is the intended behavior: `fireEvent(instance, 'layout')`
// still bubbles (with a deprecation warning) for compatibility, and will match this in the next
// major version.
fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  ensureInstanceForEvent(instance, 'layout', fireEvent.layout);
  await fireEventInternal(instance, {
    type: 'layout',
    data: [wrapNativeEvent(buildLayoutNativeEvent(layout))],
    bubbles: false,
  });
};

type FireEventOptions = {
  type: EventType;
  data: unknown[];
  bubbles: boolean;
};

async function fireEventInternal(instance: TestInstance, options: FireEventOptions) {
  const { type, data, bubbles } = options;
  if (!isInstanceMounted(instance)) {
    return;
  }

  const hasUpdatedNativeState = updateNativeStateFromEvent(
    instance,
    normalizeEventType(type),
    data[0],
  );

  const { handler, skippedTargets } = findEventHandler(instance, type, { bubbles });
  if (!handler) {
    warnAboutUnhandledEvent(instance, type, { skippedTargets, hasUpdatedNativeState });
    return;
  }

  let returnValue;
  await act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
}

export { fireEvent };
