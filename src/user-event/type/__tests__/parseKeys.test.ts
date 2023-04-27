import { parseKeys } from '../parseKeys';

test('parseKeys', () => {
  expect(parseKeys('')).toEqual([]);
  expect(parseKeys('a')).toEqual(['a']);
  expect(parseKeys('Hello')).toEqual(['H', 'e', 'l', 'l', 'o']);
  expect(parseKeys('ab{{cc')).toEqual(['a', 'b', '{', 'c', 'c']);
  expect(parseKeys('AB{Enter}XY')).toEqual(['A', 'B', 'Enter', 'X', 'Y']);
});

test('parseKeys with special keys', () => {
  expect(parseKeys('AB{Enter}XY')).toEqual(['A', 'B', 'Enter', 'X', 'Y']);
  expect(parseKeys('{Enter}XY')).toEqual(['Enter', 'X', 'Y']);
  expect(parseKeys('AB{Enter}')).toEqual(['A', 'B', 'Enter']);
  expect(parseKeys('A{Backspace}B')).toEqual(['A', 'Backspace', 'B']);
  expect(parseKeys('A{B}C')).toEqual(['A', 'B', 'C']);
});

test('parseKeys throws for invalid keys', () => {
  expect(() => parseKeys('{WWW}')).toThrow('Unknown key "WWW" in "{WWW}"');
  expect(() => parseKeys('AA{F1}BB')).toThrow('Unknown key "F1" in "AA{F1}BB"');
  expect(() => parseKeys('AA{BB')).toThrow('Invalid key sequence "{BB"');
});
