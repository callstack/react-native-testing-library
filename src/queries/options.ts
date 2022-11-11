import { NormalizerFn } from '../matches';

/**
 * hidden is an alias for includeHiddenElements that exists only to match react-testing-library API
 * if both hidden and includeHiddenElements values are defined, then includeHiddenElements will take precedence
 */
export type CommonQueryOptions = {
  hidden?: boolean;
  includeHiddenElements?: boolean;
};

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};
