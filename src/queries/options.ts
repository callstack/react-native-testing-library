import { NormalizerFn } from '../matches';

export type CommonQueryOptions = { hidden?: boolean };

export type TextMatchOptions = {
  exact?: boolean;
  normalizer?: NormalizerFn;
};
