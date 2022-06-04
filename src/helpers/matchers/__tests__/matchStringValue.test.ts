import { matchStringValue } from '../matchStringValue';

test.each`
  prop         | matcher     | expectedResult
  ${'hey'}     | ${'hey'}    | ${true}
  ${'hey'}     | ${/hey/}    | ${true}
  ${'hey'}     | ${'heyyyy'} | ${false}
  ${'hey'}     | ${/heyyy/}  | ${false}
  ${undefined} | ${'hey'}    | ${false}
`(
  'returns $expectedResult given prop $prop and matcher $matcher',
  ({ prop, matcher, expectedResult }) => {
    expect(matchStringValue(prop, matcher)).toEqual(expectedResult);
  }
);
