import { getConfig } from '../config';
import { NormalizerFn } from '../matches';

export type CommonQueryOptions = {
  /** Should query include elements hidden from accessibility. */
  includeHiddenElements?: boolean;

  /** RTL-compatibile alias to `includeHiddenElements`. */
  hidden?: boolean;
};

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};

export const shouldReturnCompositeComponent = () => {
  return !getConfig().useBreakingChanges;
};
