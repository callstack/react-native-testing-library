import type { AccessibilityActionInfo } from 'react-native';
import type { TestInstance } from 'test-renderer';

import { buildAccessibilityActionEvent } from '../../event-builder';
import { computeAriaDisabled } from '../../helpers/accessibility';
import { ErrorWithStack } from '../../helpers/errors';
import type { StringWithAutocomplete } from '../../types';
import type { UserEventInstance } from '../setup';
import { dispatchEvent } from '../utils';

/**
 * Standard accessibility action names recognized by React Native. Custom action
 * names are supported as well, hence the `string` fallback.
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
  const actions = instance.props.accessibilityActions as
    | ReadonlyArray<AccessibilityActionInfo>
    | undefined;

  if (!actions?.some((action) => action.name === actionName)) {
    const declared = actions?.map((action) => action.name);
    throw new ErrorWithStack(
      `accessibilityAction() called with action "${actionName}", but the element does not declare it in the "accessibilityActions" prop. ${
        declared?.length
          ? `Declared actions: ${declared.map((name) => `"${name}"`).join(', ')}.`
          : 'The element declares no accessibility actions.'
      }`,
      accessibilityAction,
    );
  }

  if (computeAriaDisabled(instance)) {
    throw new ErrorWithStack(
      `accessibilityAction() called with action "${actionName}" on a disabled element. Assistive technologies cannot trigger actions on disabled elements.`,
      accessibilityAction,
    );
  }

  await dispatchEvent(instance, 'accessibilityAction', buildAccessibilityActionEvent(actionName));
}
