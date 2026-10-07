import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import type { UserEventInstance } from '../setup';
import { Interaction, warnAboutUnhandledInteraction } from '../utils';

export async function pullToRefresh(
  this: UserEventInstance,
  instance: TestInstance,
): Promise<void> {
  if (!isHostScrollView(instance)) {
    throw new ErrorWithStack(
      `pullToRefresh() works only with host "ScrollView" instances. Passed instance has type "${instance.type}".`,
      pullToRefresh,
    );
  }

  const interaction = new Interaction('pullToRefresh', instance);
  interaction.eventNames.push('refresh');

  const refreshControl = instance.props.refreshControl;
  if (typeof refreshControl?.props?.onRefresh === 'function') {
    await act(() => {
      refreshControl.props.onRefresh();
    });
    interaction.hasCalledHandler = true;
  }

  warnAboutUnhandledInteraction(interaction);
}
