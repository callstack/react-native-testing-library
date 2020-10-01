// @flow
import act from './act';
import cleanup from './cleanup';
import fireEvent from './fireEvent';
import flushMicrotasksQueue from './flushMicroTasks';
import render from './render';
import shallow from './shallow';
import waitFor, { waitForElement } from './waitFor';
import waitForElementToBeRemoved from './waitForElementToBeRemoved';
import { within, getQueriesForElement } from './within';
import { getDefaultNormalizer } from './matches';

export { act };
export { cleanup };
export { fireEvent };
export { flushMicrotasksQueue };
export { render };
export { shallow };
export { waitFor, waitForElement };
export { waitForElementToBeRemoved };
export { within, getQueriesForElement };
export { getDefaultNormalizer };
