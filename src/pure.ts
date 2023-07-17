export { default as act } from './act';
export { default as cleanup } from './cleanup';
export { default as fireEvent } from './fireEvent';
export { default as render } from './render';
export { default as waitFor } from './waitFor';
export { default as waitForElementToBeRemoved } from './waitForElementToBeRemoved';
export { within, getQueriesForElement } from './within';

export { configure, resetToDefaults } from './config';
export {
  isHiddenFromAccessibility,
  isInaccessible,
} from './helpers/accessiblity';
export { getDefaultNormalizer } from './matches';
export { renderHook } from './renderHook';
export { screen } from './screen';

export type {
  RenderOptions,
  RenderResult,
  RenderResult as RenderAPI,
  DebugFunction,
} from './render';
export type { RenderHookOptions, RenderHookResult } from './renderHook';
export type { Config } from './config';
