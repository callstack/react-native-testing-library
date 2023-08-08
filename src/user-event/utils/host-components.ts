import { ReactTestInstance } from 'react-test-renderer';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { isHostTextInput } from '../../helpers/host-component-names';

export function isEditableTextInput(element: ReactTestInstance) {
  return isHostTextInput(element) && element.props.editable !== false;
}

export function isFocusableTextInput(element: ReactTestInstance) {
  return isHostTextInput(element) && isPointerEventEnabled(element);
}
