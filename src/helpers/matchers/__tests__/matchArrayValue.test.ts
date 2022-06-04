import { matchArrayValue } from '../matchArrayValue';

test('returns true given 2 identical prop and matcher', () => {
  expect(matchArrayValue(['banana'], ['banana'])).toEqual(true);
  expect(matchArrayValue(['banana', 'apple'], ['banana', 'apple'])).toEqual(
    true
  );
});

test('returns true when the prop contains all the values of the matcher', () => {
  expect(
    matchArrayValue(['banana', 'apple', 'orange'], ['banana', 'orange'])
  ).toEqual(true);
});

test('returns false when the prop does not contain all the values of the matcher', () => {
  expect(
    matchArrayValue(['banana', 'apple', 'orange'], ['banana', 'pear'])
  ).toEqual(false);
});

test('returns false when prop is undefined', () => {
  expect(matchArrayValue(undefined, ['banana'])).toEqual(false);
});

test('returns false when the matcher is an empty list', () => {
  expect(matchArrayValue(['banana'], [])).toEqual(false);
});

test('returns false given 2 different prop and matchers', () => {
  expect(matchArrayValue(['banana', 'apple'], ['banana', 'orange'])).toEqual(
    false
  );
});
