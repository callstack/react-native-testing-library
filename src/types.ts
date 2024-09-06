/**
 * Scroll position of a scrollable element.
 */
export interface ContentOffset {
  y: number;
  x: number;
}

// TS autocomplete trick
// Ref: https://github.com/microsoft/TypeScript/issues/29729#issuecomment-567871939
export type StringWithAutocomplete<T> = T | (string & {});
