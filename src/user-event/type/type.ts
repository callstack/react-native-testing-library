import { ReactTestInstance } from 'react-test-renderer';
import { isHostTextInput } from '../../helpers/host-component-names';
import { EventBuilder } from '../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isTextInputEditable } from '../../helpers/text-input';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, wait, getTextContentSize } from '../utils';
import { parseKeys } from './parse-keys';

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
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `type() works only with host "TextInput" elements. Passed element has type "${element.type}".`,
      type
    );
  }

  // Skip events if the element is disabled
  if (!isTextInputEditable(element) || !isPointerEventEnabled(element)) {
    return;
  }

  const keys = parseKeys(text);

  if (!options?.skipPress) {
    dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());
  }

  dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  if (!options?.skipPress) {
    await wait(this.config);
    dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());
  }

  let currentText = element.props.value ?? element.props.defaultValue ?? '';
  for (const key of keys) {
    const previousText = element.props.value ?? currentText;
    currentText = applyKey(previousText, key);

    await emitTypingEvents(
      this.config,
      element,
      key,
      currentText,
      previousText
    );
  }

  const finalText = element.props.value ?? currentText;
  await wait(this.config);

  if (options?.submitEditing) {
    dispatchEvent(
      element,
      'submitEditing',
      EventBuilder.TextInput.submitEditing(finalText)
    );
  }

  dispatchEvent(
    element,
    'endEditing',
    EventBuilder.TextInput.endEditing(finalText)
  );

  dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}

export async function emitTypingEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  key: string,
  currentText: string,
  previousText: string
) {
  const isMultiline = element.props.multiline === true;

  await wait(config);
  dispatchEvent(element, 'keyPress', EventBuilder.TextInput.keyPress(key));

  // According to the docs only multiline TextInput emits textInput event
  // @see: https://github.com/facebook/react-native/blob/42a2898617da1d7a98ef574a5b9e500681c8f738/packages/react-native/Libraries/Components/TextInput/TextInput.d.ts#L754
  if (isMultiline) {
    dispatchEvent(
      element,
      'textInput',
      EventBuilder.TextInput.textInput(currentText, previousText)
    );
  }

  dispatchEvent(element, 'change', EventBuilder.TextInput.change(currentText));
  dispatchEvent(element, 'changeText', currentText);

  const selectionRange = {
    start: currentText.length,
    end: currentText.length,
  };
  dispatchEvent(
    element,
    'selectionChange',
    EventBuilder.TextInput.selectionChange(selectionRange)
  );

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  if (isMultiline) {
    const contentSize = getTextContentSize(currentText);
    dispatchEvent(
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
