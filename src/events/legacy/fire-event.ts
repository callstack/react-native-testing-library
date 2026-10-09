import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { isHostScrollView } from '../../helpers/host-component-names';
import { normalizeEventType } from '../shared/handler';
import { nativeState } from '../shared/native-state';
import type { EventProps, EventType, LayoutRectangle } from '../shared/types';
import { updateNativeStateFromEvent } from '../shared/update-native-state';
import { buildLayoutEvent, buildTouchEvent } from './builders/common';
import { mergeEventProps } from './builders/merge';
import { buildScrollEvent } from './builders/scroll';
import { findEventHandler } from './propagation';
import { warnAboutUnhandledEvent } from './warnings';

async function fireEvent(instance: TestInstance, eventType: EventType, ...data: unknown[]) {
  return await fireEventInternal(instance, { type: eventType, data, bubbles: true });
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

// Does not bubble and checks only the element's own props, as React Native delivers layout events
// only to the measured element. This is the intended behavior: `fireEvent(instance, 'layout')`
// still bubbles (with a deprecation warning) for compatibility, and will match this in the next
// major version.
fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEventInternal(instance, {
    type: 'layout',
    data: [buildLayoutEvent(layout)],
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

export { fireEvent };
