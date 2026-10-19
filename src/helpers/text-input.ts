import type { TestInstance } from 'test-renderer';

import { nativeState } from '../events/native-state';
import { isHostTextInput } from './host-component-names';

/**
 * Whether the element is a host `TextInput` the user can edit. As in React Native's `TextInput`,
 * `readOnly` wins over `editable`. The Jest preset mocks `TextInput`, so its host element gets
 * both props unchanged.
 */
export function isEditableTextInput(instance: TestInstance) {
  if (!isHostTextInput(instance)) {
    return false;
  }

  const { readOnly, editable } = instance.props;
  return readOnly !== undefined ? !readOnly : editable !== false;
}

export function getTextInputValue(instance: TestInstance) {
  if (!isHostTextInput(instance)) {
    throw new Error(`Element is not a "TextInput", but it has type "${instance.type}".`);
  }

  return (
    instance.props.value ??
    nativeState.valueForInstance.get(instance) ??
    instance.props.defaultValue ??
    ''
  );
}
