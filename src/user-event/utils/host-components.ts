import { ReactTestInstance } from 'react-test-renderer';
import { isHostTextInput } from '../../helpers/host-component-names';

export function isEditableTextInput(element: ReactTestInstance) {
  return isHostTextInput(element) && element.props.editable !== false;
}
