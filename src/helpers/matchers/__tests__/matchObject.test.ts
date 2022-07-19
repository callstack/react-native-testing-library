import { matchObjectProp } from '../matchObjectProp';

test('returns true given 2 identical objects', () => {
  expect(matchObjectProp({ fruit: 'banana' }, { fruit: 'banana' })).toEqual(
    true
  );
  expect(
    matchObjectProp(
      { fruit: 'banana', isRipe: true },
      { fruit: 'banana', isRipe: true }
    )
  ).toEqual(true);
});

test('returns false when one of the param is an empty object', () => {
  expect(matchObjectProp({}, { fruit: 'banana' })).toEqual(false);
  expect(matchObjectProp({ fruit: 'banana' }, {})).toEqual(false);
});

test('returns false given an undefined prop', () => {
  expect(matchObjectProp(undefined, { fruit: 'banana' })).toEqual(false);
});

test('returns false given 2 different non empty objects', () => {
  expect(matchObjectProp({ fruit: 'banana' }, { fruits: 'banana' })).toEqual(
    false
  );
  expect(matchObjectProp({ fruit: 'banana' }, { fruit: 'orange' })).toEqual(
    false
  );
  expect(
    matchObjectProp(
      { fruit: 'banana', isRipe: true },
      { fruit: 'banana', ripe: true }
    )
  ).toEqual(false);
});
