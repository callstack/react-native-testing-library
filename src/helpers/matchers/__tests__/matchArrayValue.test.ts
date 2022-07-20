import { matchArrayProp } from '../matchArrayProp';

test('returns true given 2 identical prop and matcher', () => {
  expect(matchArrayProp(['banana'], ['banana'])).toEqual(true);
  expect(matchArrayProp(['banana', 'apple'], ['banana', 'apple'])).toEqual(
    true
  );
});

test('returns true when the prop contains all the values of the matcher', () => {
  expect(
    matchArrayProp(['banana', 'apple', 'orange'], ['banana', 'orange'])
  ).toEqual(true);
});

test('returns false when the prop does not contain all the values of the matcher', () => {
  expect(
    matchArrayProp(['banana', 'apple', 'orange'], ['banana', 'pear'])
  ).toEqual(false);
});

test('returns false when prop is undefined', () => {
  expect(matchArrayProp(undefined, ['banana'])).toEqual(false);
});

test('returns false when the matcher is an empty list', () => {
  expect(matchArrayProp(['banana'], [])).toEqual(false);
});

test('returns false given 2 different prop and matchers', () => {
  expect(matchArrayProp(['banana', 'apple'], ['banana', 'orange'])).toEqual(
    false
  );
});
