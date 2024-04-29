export { default as act } from './act';
export { default as cleanup } from './cleanup';
export { default as fireEvent } from './fire-event';
export { default as render } from './render';
export { default as waitFor } from './wait-for';
export { default as waitForElementToBeRemoved } from './wait-for-element-to-be-removed';
export { within, getQueriesForElement } from './within';

export { configure, resetToDefaults } from './config';
export { isHiddenFromAccessibility, isInaccessible } from './helpers/accessibility';
export { getDefaultNormalizer } from './matches';
export { renderHook } from './render-hook';
export { screen } from './screen';
export { userEvent } from './user-event';

export type {
  RenderOptions,
  RenderResult,
  RenderResult as RenderAPI,
  DebugFunction,
} from './render';
export type { RenderHookOptions, RenderHookResult } from './render-hook';
export type { Config } from './config';
export type { UserEventConfig } from './user-event';
