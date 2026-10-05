import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import { isHostScrollView } from '../helpers/host-component-names';
import type { StringWithAutocomplete } from '../types';
import type { LayoutRectangle } from './builders';
import { buildLayoutEvent, buildScrollEvent, buildTouchEvent, mergeEventProps } from './builders';
import { nativeState } from './native-state';
import { findEventHandler } from './propagation';
import { updateNativeStateFromEvent } from './update-native-state';

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

  const handler = findEventHandler(instance, eventName);
  if (!handler) {
    return;
  }

  let returnValue;
  await act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
}

type EventProps = Record<string, unknown>;

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

fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEvent(instance, 'layout', buildLayoutEvent(layout));
};

export { fireEvent };
