import type { ReactTestInstance } from 'react-test-renderer';

import act from '../../act';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import type { UserEventInstance } from '../setup';

export async function pullToRefresh(
  this: UserEventInstance,
  element: ReactTestInstance,
): Promise<void> {
  if (!isHostScrollView(element)) {
    throw new ErrorWithStack(
      `pullToRefresh() works only with host "ScrollView" elements. Passed element has type "${element.type}".`,
      pullToRefresh,
    );
  }

  const refreshControl = element.props.refreshControl;
  if (refreshControl == null || typeof refreshControl.props.onRefresh !== 'function') {
    return;
  }

  // eslint-disable-next-line require-await
  await act(async () => {
    refreshControl.props.onRefresh();
  });
}
