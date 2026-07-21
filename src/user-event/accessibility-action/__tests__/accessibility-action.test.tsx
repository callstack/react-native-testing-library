import * as React from 'react';
import type { AccessibilityActionEvent } from 'react-native';
import { View } from 'react-native';

import { render, screen, userEvent } from '../../..';
import { createEventLogger, lastEventPayload } from '../../../test-utils/events';

async function renderViewWithActions(props: React.ComponentProps<typeof View> = {}) {
  const { events, logEvent } = createEventLogger();

  await render(
    <View
      testID="view"
      accessible
      accessibilityActions={[{ name: 'increment' }, { name: 'activate', label: 'Activate' }]}
      onAccessibilityAction={(event: AccessibilityActionEvent) =>
        logEvent('accessibilityAction')(event)
      }
      {...props}
    />,
  );

  return { events };
}

describe('userEvent.accessibilityAction', () => {
  it('triggers the onAccessibilityAction handler with the given action name', async () => {
    const user = userEvent.setup();
    const { events } = await renderViewWithActions();

    await user.accessibilityAction(screen.getByTestId('view'), 'increment');

    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('accessibilityAction');
    expect(lastEventPayload(events, 'accessibilityAction').nativeEvent).toEqual({
      actionName: 'increment',
    });
  });

  it('supports the direct (setup-less) call form', async () => {
    const { events } = await renderViewWithActions();

    await userEvent.accessibilityAction(screen.getByTestId('view'), 'activate');

    expect(events).toHaveLength(1);
    expect(lastEventPayload(events, 'accessibilityAction').nativeEvent.actionName).toBe('activate');
  });

  it('throws when the action is not declared in accessibilityActions', async () => {
    const user = userEvent.setup();
    await renderViewWithActions();

    await expect(user.accessibilityAction(screen.getByTestId('view'), 'decrement')).rejects.toThrow(
      /does not declare it in the "accessibilityActions" prop.*"increment", "activate"/s,
    );
  });

  it('throws when the element declares no accessibility actions', async () => {
    const user = userEvent.setup();
    await renderViewWithActions({ accessibilityActions: undefined });

    await expect(user.accessibilityAction(screen.getByTestId('view'), 'increment')).rejects.toThrow(
      /declares no accessibility actions/,
    );
  });

  it('throws when the element is disabled', async () => {
    const user = userEvent.setup();
    await renderViewWithActions({ 'aria-disabled': true });

    await expect(user.accessibilityAction(screen.getByTestId('view'), 'increment')).rejects.toThrow(
      /on a disabled element/,
    );
  });

  it('throws when the element is disabled via accessibilityState', async () => {
    const user = userEvent.setup();
    await renderViewWithActions({ accessibilityState: { disabled: true } });

    await expect(user.accessibilityAction(screen.getByTestId('view'), 'increment')).rejects.toThrow(
      /on a disabled element/,
    );
  });
});
