import { ReactTestInstance } from 'react-test-renderer';
import { getHostComponentNames } from '../../helpers/host-component-names';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { UserEventInstance } from '../setup';
import {
  dispatchOwnHostEvent,
  wait,
  getTextRange,
  getTextContentSize,
} from '../utils';

import { parseKeys } from './parseKeys';

export interface TypeOptions {
  skipPress?: boolean;
  submitEditing?: boolean;
}

export async function type(
  this: UserEventInstance,
  element: ReactTestInstance,
  text: string,
  options?: TypeOptions
): Promise<void> {
  if (element.type !== getHostComponentNames().textInput) {
    throw new ErrorWithStack(
      `type() works only with "TextInput" elements. Passed element has type "${element.type}".`,
      type
    );
  }

  const keys = parseKeys(text);

  if (!options?.skipPress) {
    dispatchOwnHostEvent(element, 'pressIn', EventBuilder.Common.touch());
  }

  dispatchOwnHostEvent(element, 'focus', EventBuilder.Common.focus());

  if (!options?.skipPress) {
    await wait(this.config);
    dispatchOwnHostEvent(element, 'pressOut', EventBuilder.Common.touch());
  }

  let currentText = element.props.value ?? element.props.defaultValue ?? '';
  for (const key of keys) {
    const previousText = element.props.value ?? currentText;
    currentText = applyKey(previousText, key);

    await wait(this.config);
    emitTypingEvents(element, key, currentText, previousText);
  }

  const finalText = element.props.value ?? currentText;

  await wait(this.config);

  if (options?.submitEditing) {
    dispatchOwnHostEvent(
      element,
      'submitEditing',
      EventBuilder.TextInput.submitEditing(finalText)
    );
  }

  dispatchOwnHostEvent(
    element,
    'endEditing',
    EventBuilder.TextInput.endEditing(finalText)
  );

  dispatchOwnHostEvent(element, 'blur', EventBuilder.Common.blur());
}

async function emitTypingEvents(
  element: ReactTestInstance,
  key: string,
  currentText: string,
  previousText: string
) {
  const isMultiline = element.props.multiline === true;

  dispatchOwnHostEvent(
    element,
    'keyPress',
    EventBuilder.TextInput.keyPress(key)
  );

  if (isMultiline) {
    dispatchOwnHostEvent(
      element,
      'textInput',
      EventBuilder.TextInput.textInput(currentText, previousText)
    );
  }

  dispatchOwnHostEvent(
    element,
    'change',
    EventBuilder.TextInput.change(currentText)
  );

  dispatchOwnHostEvent(element, 'changeText', currentText);

  const selectionRange = getTextRange(currentText);
  dispatchOwnHostEvent(
    element,
    'selectionChange',
    EventBuilder.TextInput.selectionChange(selectionRange)
  );

  if (isMultiline) {
    const contentSize = getTextContentSize(currentText);
    dispatchOwnHostEvent(
      element,
      'contentSizeChange',
      EventBuilder.TextInput.contentSizeChange(contentSize)
    );
  }
}

function applyKey(text: string, key: string) {
  if (key === 'Enter') {
    return `${text}\n`;
  }

  if (key === 'Backspace') {
    return text.slice(0, -1);
  }

  return text + key;
}
