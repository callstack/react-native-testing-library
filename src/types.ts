/** `RefObject` type from React 19. */
export type RefObject<T> = {
  current: T;
};

/**
 * Location of an element.
 */
export interface Point {
  y: number;
  x: number;
}

/**
 * Size of an element.
 */
export interface Size {
  height: number;
  width: number;
}

/**
 * Range of text in a text input.
 */
export interface TextRange {
  start: number;
  end: number;
}

// TS autocomplete trick
// Ref: https://github.com/microsoft/TypeScript/issues/29729#issuecomment-567871939
export type StringWithAutocomplete<T> = T | (string & {});
