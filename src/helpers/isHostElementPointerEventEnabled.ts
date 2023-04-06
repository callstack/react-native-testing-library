import { ReactTestInstance } from 'react-test-renderer';
import { getHostParent } from './component-tree';

export const isHostElementPointerEventEnabled = (
  element: ReactTestInstance,
  isParent?: boolean
): boolean => {
  const parentCondition = isParent
    ? element?.props.pointerEvents === 'box-only'
    : element?.props.pointerEvents === 'box-none';

  if (element?.props.pointerEvents === 'none' || parentCondition) {
    return false;
  }

  const hostParent = getHostParent(element);
  if (!hostParent) return true;

  return isHostElementPointerEventEnabled(hostParent, true);
};
