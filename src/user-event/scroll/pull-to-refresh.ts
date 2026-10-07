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

  // `refreshControl` is an element prop, not a rendered host instance, so `dispatchEvent`
  // can't reach its `onRefresh` handler.
  const onRefresh = instance.props.refreshControl?.props?.onRefresh;
  const hasHandler = typeof onRefresh === 'function';
  if (hasHandler) {
    await act(() => {
      onRefresh();
    });
  }

  interaction.recordEvent('refresh', hasHandler);
  warnAboutUnhandledInteraction(interaction);
}
