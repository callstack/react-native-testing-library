import type { TestInstance } from 'test-renderer';

import {
  buildBlurEvent,
  buildEndEditingEvent,
  buildFocusEvent,
  buildTextSelectionChangeEvent,
} from '../event-builder';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import type { UserEventInstance } from './setup';
import { emitTypingEvents } from './type/type';
import { dispatchEvent, wait } from './utils';

export async function clear(this: UserEventInstance, instance: TestInstance): Promise<void> {
  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `clear() only supports host "TextInput" instances. Passed instance has type: "${instance.type}".`,
      clear,
    );
  }

  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    return;
  }

  // 1. Enter instance
  await dispatchEvent(instance, 'focus', buildFocusEvent());

  // 2. Select all
  const textToClear = getTextInputValue(instance);
  const selectionRange = {
    start: 0,
    end: textToClear.length,
  };
  await dispatchEvent(instance, 'selectionChange', buildTextSelectionChangeEvent(selectionRange));

  // 3. Press backspace with selected text
  const emptyText = '';
  await emitTypingEvents(instance, {
    config: this.config,
    key: 'Backspace',
    text: emptyText,
  });

  // 4. Exit instance
  await wait(this.config);
  await dispatchEvent(instance, 'endEditing', buildEndEditingEvent(emptyText));
  await dispatchEvent(instance, 'blur', buildBlurEvent());
}
