export { default as act } from './act';
export { default as cleanup, cleanupAsync } from './cleanup';
export { fireEvent, deprecated_fireEventSync } from './fire-event';
export { default as deprecated_renderSync } from './deprecated/render-sync';
export { default as render } from './render';
export { default as waitFor } from './wait-for';
export { default as waitForElementToBeRemoved } from './wait-for-element-to-be-removed';
export { within, getQueriesForElement } from './within';

export { configure, resetToDefaults } from './config';
export { isHiddenFromAccessibility, isInaccessible } from './helpers/accessibility';
export { getDefaultNormalizer } from './matches';
export { renderHook, deprecated_renderHookSync } from './render-hook';
export { screen } from './screen';
export { userEvent } from './user-event';

export type { RenderSyncOptions, RenderSyncResult, DebugFunction } from './deprecated/render-sync';
export type { RenderOptions, RenderResult, RenderResult as RenderAPI } from './render';
export type { RenderHookOptions, RenderHookResult, RenderHookSyncResult } from './render-hook';
export type { Config } from './config';
export type { UserEventConfig } from './user-event';
