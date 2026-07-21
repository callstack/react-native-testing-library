import type { AccessibilityActionInfo } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { buildAccessibilityActionEvent } from '../../event-builder';
import { computeAriaDisabled } from '../../helpers/accessibility';
import { isTestInstance } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import type { StringWithAutocomplete } from '../../types';
import type { UserEventInstance } from '../setup';
import { dispatchEvent } from '../utils';

/**
 * Standard accessibility action names recognized by React Native (`activate`,
 * `increment`, `decrement`, `longpress`, `magicTap`, `escape`, `expand`,
 * `collapse`). Custom action names are supported as well, hence the `string`
 * fallback.
 *
 * @see https://reactnative.dev/docs/accessibility#accessibility-actions
 */
export type AccessibilityActionName = StringWithAutocomplete<
  | 'activate'
  | 'increment'
  | 'decrement'
  | 'longpress'
  | 'magicTap'
  | 'escape'
  | 'expand'
  | 'collapse'
>;

/**
 * Simulate an assistive technology (e.g. screen reader) triggering an
 * accessibility action on a given element.
 *
 * This will call the `onAccessibilityAction` handler with an event carrying the
 * given `actionName`.
 *
 * Like a real assistive technology, the action must be declared in the element's
 * `accessibilityActions` prop, and the element must not be disabled. Otherwise an
 * error is thrown.
 *
 * @param instance element to trigger the action on
 * @param actionName name of the accessibility action to trigger
 */
export async function accessibilityAction(
  this: UserEventInstance,
  instance: TestInstance,
  actionName: AccessibilityActionName,
): Promise<void> {
  if (!isTestInstance(instance)) {
    throw new ErrorWithStack(
      `accessibilityAction() works only with host instances.`,
      accessibilityAction,
    );
  }

  const actions = instance.props.accessibilityActions as
    | ReadonlyArray<AccessibilityActionInfo>
    | undefined;

  if (!actions?.length) {
    throw new ErrorWithStack(
      `The element has no accessibility actions. Add them using the "accessibilityActions" prop.`,
      accessibilityAction,
    );
  }

  if (!actions.some((action) => action.name === actionName)) {
    const available = actions.map((action) => `"${action.name}"`).join(', ');
    throw new ErrorWithStack(
      `The element has no "${actionName}" accessibility action. Available actions: ${available}.`,
      accessibilityAction,
    );
  }

  if (computeAriaDisabled(instance)) {
    throw new ErrorWithStack(
      `Cannot trigger the "${actionName}" accessibility action on a disabled element.`,
      accessibilityAction,
    );
  }

  await dispatchEvent(instance, 'accessibilityAction', buildAccessibilityActionEvent(actionName));
}
