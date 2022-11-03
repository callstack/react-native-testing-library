import { NormalizerFn } from '../matches';

export type BaseOptions = { hidden?: boolean };

export type TextMatchOptions = BaseOptions & {
  exact?: boolean;
  normalizer?: NormalizerFn;
};
