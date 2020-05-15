// @flow
import { getByAPI } from './helpers/getByAPI';
import { queryByAPI } from './helpers/queryByAPI';
import { findByAPI } from './helpers/findByAPI';
import a11yAPI from './helpers/a11yAPI';

export default function within(instance: ReactTestInstance) {
  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...findByAPI(instance),
    ...a11yAPI(instance),
  };
}
