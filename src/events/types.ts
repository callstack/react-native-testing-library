import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';

import type { StringWithAutocomplete } from '../types';

export type EventHandler = (...args: unknown[]) => unknown;

export type EventProps = Record<string, unknown>;

// String union type of keys of T that start with on, stripped of 'on'
type EventNameExtractor<T> = keyof {
  [K in keyof T as K extends `on${infer Rest}` ? Uncapitalize<Rest> : never]: T[K];
};

export type EventName = StringWithAutocomplete<
  | EventNameExtractor<ViewProps>
  | EventNameExtractor<TextProps>
  | EventNameExtractor<TextInputProps>
  | EventNameExtractor<PressableProps>
  | EventNameExtractor<ScrollViewProps>
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
