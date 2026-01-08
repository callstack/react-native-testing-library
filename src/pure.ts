export { act } from './act';
export { cleanup } from './cleanup';
export { fireEvent } from './fire-event';
export { render } from './render';
export { waitFor } from './wait-for';
export { waitForElementToBeRemoved } from './wait-for-element-to-be-removed';
export { within } from './within';

export { configure, resetToDefaults } from './config';
export { isHiddenFromAccessibility, isInaccessible } from './helpers/accessibility';
export { getDefaultNormalizer } from './matches';
export { renderHook } from './render-hook';
export { screen } from './screen';
export { userEvent } from './user-event';

export type { RenderOptions, RenderResult, DebugFunction } from './render';
export type { RenderHookOptions, RenderHookResult } from './render-hook';
export type { Config } from './config';
export type { UserEventConfig } from './user-event';
