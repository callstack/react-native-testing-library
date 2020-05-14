// @flow
import { getByAPI } from './helpers/getByAPI';
import { queryByAPI } from './helpers/queryByAPI';
import a11yAPI from './helpers/a11yAPI';

export default function within(instance: ReactTestInstance) {
  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...a11yAPI(instance),
  };
}
