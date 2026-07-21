import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import type { UserEventInstance } from '../setup';

export async function pullToRefresh(
  this: UserEventInstance,
  instance: TestInstance,
): Promise<void> {
  if (!isHostScrollView(instance)) {
    throw new ErrorWithStack(
      `pullToRefresh() works only with host "ScrollView" elements. Passed element has type "${instance.type}".`,
      pullToRefresh,
    );
  }

  const refreshControl = instance.props.refreshControl;
  if (refreshControl == null || typeof refreshControl.props.onRefresh !== 'function') {
    return;
  }

  // eslint-disable-next-line require-await
  await act(async () => {
    refreshControl.props.onRefresh();
  });
}
