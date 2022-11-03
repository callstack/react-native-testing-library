import { NormalizerFn } from '../matches';

export type CommonQueryOptions = { hidden?: boolean };

export type TextMatchOptions = CommonQueryOptions & {
  exact?: boolean;
  normalizer?: NormalizerFn;
};
