import { NormalizerFn } from '../matches';

/**
 * hidden is an alias for includeHidden that exists only to match react-testing-library API
 * if both hidden and includeHidden values are defined, then includeHidden will take precedence
 */
export type CommonQueryOptions = { hidden?: boolean; includeHidden?: boolean };

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};
