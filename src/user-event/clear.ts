import type { ReactTestInstance } from 'react-test-renderer';

import { ErrorWithStack } from '../helpers/errors';
import { formatElement } from '../helpers/format-element';
import { isHostTextInput } from '../helpers/host-component-names';
import { logger } from '../helpers/logger';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import { EventBuilder } from './event-builder';
import type { UserEventInstance } from './setup';
import { emitTypingEvents } from './type/type';
import { dispatchEvent, wait } from './utils';

export async function clear(this: UserEventInstance, element: ReactTestInstance): Promise<void> {
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `clear() only supports host "TextInput" elements. Passed element has type: "${element.type}".`,
      clear,
    );
  }

  if (!isEditableTextInput(element)) {
    logger.warn(
      `User Event (clear): element ${formatElement(element, { compact: true })} is not editable.`,
    );
    return;
  }

  if (!isPointerEventEnabled(element)) {
    logger.warn(
      `User Event (clear): element ${formatElement(element, { compact: true })} has pointer event handlers disabled.`,
    );
    return;
  }

  // 1. Enter element
  await dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  // 2. Select all
  const textToClear = getTextInputValue(element);
  const selectionRange = {
    start: 0,
    end: textToClear.length,
  };
  await dispatchEvent(
    element,
    'selectionChange',
    EventBuilder.TextInput.selectionChange(selectionRange),
  );

  // 3. Press backspace with selected text
  const emptyText = '';
  await emitTypingEvents(element, {
    config: this.config,
    key: 'Backspace',
    text: emptyText,
  });

  // 4. Exit element
  await wait(this.config);
  await dispatchEvent(element, 'endEditing', EventBuilder.TextInput.endEditing(emptyText));
  await dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}
