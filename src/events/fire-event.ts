import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import { isHostScrollView } from '../helpers/host-component-names';
import { buildLayoutEvent, buildTouchEvent } from './builders/common';
import { mergeEventProps } from './builders/merge';
import { buildScrollEvent } from './builders/scroll';
import { normalizeEventType } from './handler';
import { nativeState } from './native-state';
import { findEventHandler } from './propagation';
import type { EventProps, EventType, LayoutRectangle } from './types';
import { updateNativeStateFromEvent } from './update-native-state';
import { warnAboutUnhandledEvent } from './warnings';

async function fireEvent(instance: TestInstance, eventType: EventType, ...data: unknown[]) {
  return await fireEventInternal(instance, { type: eventType, data, bubbles: true });
}

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

  // `fireEvent` accepts event types with and without the `on*` prefix.
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

fireEvent.changeText = async (instance: TestInstance, text: string) =>
  await fireEvent(instance, 'changeText', text);

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps) => {
  await fireEvent(instance, 'press', mergeEventProps(buildTouchEvent(), eventProps));
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps) => {
  const layoutMeasurement = isHostScrollView(instance)
    ? nativeState.layoutSizeForInstance.get(instance)
    : undefined;
  const event = buildScrollEvent(undefined, { layoutMeasurement });
  await fireEvent(instance, 'scroll', mergeEventProps(event, eventProps));
};

// Unlike `fireEvent(instance, 'layout')`, does not bubble, as React Native delivers layout events
// only to the measured element.
fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEventInternal(instance, {
    type: 'layout',
    data: [buildLayoutEvent(layout)],
    bubbles: false,
  });
};

export { fireEvent };
