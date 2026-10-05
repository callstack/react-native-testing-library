import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { TestInstance } from 'test-renderer';

import type { LayoutRectangle } from './events';
import {
  buildLayoutEvent,
  buildScrollEvent,
  buildTouchEvent,
  nativeState,
  propagateEvent,
  updateNativeStateFromEvent,
} from './events';
import { isInstanceMounted } from './helpers/component-tree';
import { isHostScrollView } from './helpers/host-component-names';
import type { StringWithAutocomplete } from './types';

// String union type of keys of T that start with on, stripped of 'on'
type EventNameExtractor<T> = keyof {
  [K in keyof T as K extends `on${infer Rest}` ? Uncapitalize<Rest> : never]: T[K];
};

type EventName = StringWithAutocomplete<
  | EventNameExtractor<ViewProps>
  | EventNameExtractor<TextProps>
  | EventNameExtractor<TextInputProps>
  | EventNameExtractor<PressableProps>
  | EventNameExtractor<ScrollViewProps>
>;

async function fireEvent(instance: TestInstance, eventName: EventName, ...data: unknown[]) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  updateNativeStateFromEvent(instance, eventName, data[0]);
  return await propagateEvent(instance, eventName, ...data);
}

type EventProps = Record<string, unknown>;

fireEvent.changeText = async (instance: TestInstance, text: string) =>
  await fireEvent(instance, 'changeText', text);

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps) => {
  const event = buildTouchEvent();
  if (eventProps) {
    mergeEventProps(event, eventProps);
  }

  await fireEvent(instance, 'press', event);
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps) => {
  const layoutMeasurement = isHostScrollView(instance)
    ? nativeState.layoutSizeForInstance.get(instance)
    : undefined;
  const event = buildScrollEvent(undefined, { layoutMeasurement });
  if (eventProps) {
    mergeEventProps(event, eventProps);
  }

  await fireEvent(instance, 'scroll', event);
};

fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEvent(instance, 'layout', buildLayoutEvent(layout));
};

export { fireEvent };

function mergeEventProps(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (
      sourceValue != null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      mergeEventProps(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      );
    } else {
      target[key] = sourceValue;
    }
  }
}
