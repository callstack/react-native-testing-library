// TS autocomplete trick
// Ref: https://github.com/microsoft/TypeScript/issues/29729#issuecomment-567871939
export type StringWithAutocomplete<T> = T | (string & {});
