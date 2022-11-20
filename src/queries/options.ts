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

export type LegacyQueryOptions = {
  legacy?: boolean;
};

export const shouldReturnCompositeComponent = (option: LegacyQueryOptions) => {
  if (option.legacy === false) {
    return false;
  }

  return option.legacy || getConfig().useLegacyQueries;
};
