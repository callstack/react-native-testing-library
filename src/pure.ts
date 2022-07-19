import act from './act';
import cleanup from './cleanup';
import fireEvent from './fireEvent';
import render, { RenderResult } from './render';
import waitFor from './waitFor';
import waitForElementToBeRemoved from './waitForElementToBeRemoved';
import { within, getQueriesForElement } from './within';
import { getDefaultNormalizer } from './matches';
import { renderHook } from './renderHook';
import { screen } from './screen';

export type { RenderResult };
export type RenderAPI = RenderResult;

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
