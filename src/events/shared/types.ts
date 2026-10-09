import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';

import type { StringWithAutocomplete } from '../../types';

export type EventHandler = (...args: unknown[]) => unknown;

export type EventProps = Record<string, unknown>;

// String union type of keys of T that start with on, stripped of 'on'
type EventTypeExtractor<T> = keyof {
  [K in keyof T as K extends `on${infer Rest}` ? Uncapitalize<Rest> : never]: T[K];
};

export type EventType = StringWithAutocomplete<
  | EventTypeExtractor<ViewProps>
  | EventTypeExtractor<TextProps>
  | EventTypeExtractor<TextInputProps>
  | EventTypeExtractor<PressableProps>
  | EventTypeExtractor<ScrollViewProps>
>;

/**
 * Layout rectangle of an element, as measured by the layout engine.
 */
export interface LayoutRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
