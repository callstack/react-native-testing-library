import act from './act';
import cleanup from './cleanup';
import fireEvent from './fireEvent';
import render from './render';
import waitFor from './waitFor';
import waitForElementToBeRemoved from './waitForElementToBeRemoved';
import { within, getQueriesForElement } from './within';
import { getDefaultNormalizer } from './matches';
import { renderHook } from './renderHook';
import { screen } from './screen';
import { isInaccessible } from './helpers/accessiblity';

export type {
  RenderOptions,
  RenderResult,
  RenderResult as RenderAPI,
} from './render';
export type { RenderHookOptions, RenderHookResult } from './renderHook';

export { act };
export { cleanup };
export { fireEvent };
export { render };
export { waitFor };
export { waitForElementToBeRemoved };
export { within, getQueriesForElement };
export { getDefaultNormalizer };
export { renderHook };
export { screen };
export { isInaccessible };
