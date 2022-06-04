import { matchObject } from '../matchObject';

test('returns true given 2 identical objects', () => {
  expect(matchObject({ fruit: 'banana' }, { fruit: 'banana' })).toEqual(true);
  expect(
    matchObject(
      { fruit: 'banana', isRipe: true },
      { fruit: 'banana', isRipe: true }
    )
  ).toEqual(true);
});

test('returns false when one of the param is an empty object', () => {
  expect(matchObject({}, { fruit: 'banana' })).toEqual(false);
  expect(matchObject({ fruit: 'banana' }, {})).toEqual(false);
});

test('returns false given an undefined prop', () => {
  expect(matchObject(undefined, { fruit: 'banana' })).toEqual(false);
});

test('returns false given 2 different non empty objects', () => {
  expect(matchObject({ fruit: 'banana' }, { fruits: 'banana' })).toEqual(false);
  expect(matchObject({ fruit: 'banana' }, { fruit: 'orange' })).toEqual(false);
  expect(
    matchObject(
      { fruit: 'banana', isRipe: true },
      { fruit: 'banana', ripe: true }
    )
  ).toEqual(false);
});
