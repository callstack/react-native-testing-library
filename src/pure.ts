export { default as act } from './act';
export { cleanup } from './cleanup';
export { fireEvent, unsafe_fireEventSync } from './fire-event';
export { render } from './render';
export { unsafe_renderSync } from './unsafe-render-sync';
export { waitFor } from './wait-for';
export { waitForElementToBeRemoved } from './wait-for-element-to-be-removed';
export { within, getQueriesForElement } from './within';

export { configure, resetToDefaults } from './config';
export { isHiddenFromAccessibility, isInaccessible } from './helpers/accessibility';
export { getDefaultNormalizer } from './matches';
export { renderHook, unsafe_renderHookSync } from './render-hook';
export { screen } from './screen';
export { userEvent } from './user-event';

export type { RenderSyncOptions, RenderSyncResult, DebugFunction } from './unsafe-render-sync';
export type { RenderOptions, RenderResult, RenderResult as RenderAPI } from './render';
export type { RenderHookOptions, RenderHookResult, RenderHookSyncResult } from './render-hook';
export type { Config } from './config';
export type { UserEventConfig } from './user-event';
