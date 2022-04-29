import type { ReactTestInstance } from 'react-test-renderer';
import { throwRenamedFunctionError } from '../helpers/errors';

export type FindByAPI = {};

export const findByAPI = (instance: ReactTestInstance): FindByAPI => ({});
