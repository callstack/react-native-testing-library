import type { ReactTestInstance } from 'react-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
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

  if (!isEditableTextInput(element) || !isPointerEventEnabled(element)) {
    return;
  }

  // 1. Enter element
  dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  // 2. Select all
  const textToClear = getTextInputValue(element);
  const selectionRange = {
    start: 0,
    end: textToClear.length,
  };
  dispatchEvent(element, 'selectionChange', EventBuilder.TextInput.selectionChange(selectionRange));

  // 3. Press backspace with selected text
  const emptyText = '';
  await emitTypingEvents(element, {
    config: this.config,
    key: 'Backspace',
    text: emptyText,
  });

  // 4. Exit element
  await wait(this.config);
  dispatchEvent(element, 'endEditing', EventBuilder.TextInput.endEditing(emptyText));
  dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}
