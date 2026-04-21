import type { TestInstance } from 'test-renderer';

import { nativeState } from '../native-state';
import { isHostTextInput } from './host-component-names';

export function isEditableTextInput(instance: TestInstance) {
  return isHostTextInput(instance) && instance.props.editable !== false;
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
