import { ReactTestInstance } from 'react-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { isTextInputEditable } from '../helpers/text-input';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { EventBuilder } from './event-builder';
import { UserEventInstance } from './setup';
import { dispatchEvent, wait } from './utils';
import { emitTypingEvents } from './type/type';

export async function clear(this: UserEventInstance, element: ReactTestInstance): Promise<void> {
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `clear() only supports host "TextInput" elements. Passed element has type: "${element.type}".`,
      clear
    );
  }

  if (!isTextInputEditable(element) || !isPointerEventEnabled(element)) {
    return;
  }

  // 1. Enter element
  dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  // 2. Select all
  const previousText = element.props.value ?? element.props.defaultValue ?? '';
  const selectionRange = {
    start: 0,
    end: previousText.length,
  };
  dispatchEvent(element, 'selectionChange', EventBuilder.TextInput.selectionChange(selectionRange));

  // 3. Press backspace
  const finalText = '';
  await emitTypingEvents(this.config, element, 'Backspace', finalText, previousText);

  // 4. Exit element
  await wait(this.config);
  dispatchEvent(element, 'endEditing', EventBuilder.TextInput.endEditing(finalText));

  dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}
