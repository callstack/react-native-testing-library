import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, isInaccessible } from '../..';

test('returns false for accessible elements', () => {
  expect(
    isInaccessible(render(<View testID="subject" />).getByTestId('subject'))
  ).toBe(false);

  expect(
    isInaccessible(
      render(<Text testID="subject">Hello</Text>).getByTestId('subject')
    )
  ).toBe(false);

  expect(
    isInaccessible(
      render(<TextInput testID="subject" />).getByTestId('subject')
    )
  ).toBe(false);
});

test('detects elements with display=none', () => {
  const view = render(<View testID="subject" style={{ display: 'none' }} />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects nested elements with display=none', () => {
  const view = render(
    <View style={{ display: 'none' }}>
      <View testID="subject" />
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with display=none with complex style', () => {
  const view = render(
    <View
      testID="subject"
      style={[{ display: 'flex' }, [{ display: 'flex' }], { display: 'none' }]}
    />
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with opacity=0', () => {
  const view = render(<View testID="subject" style={{ opacity: 0 }} />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects nested elements with opacity=0', () => {
  const view = render(
    <View style={{ opacity: 0 }}>
      <View testID="subject" />
    </View>
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('detects elements with opacity=0 with complex styles', () => {
  const view = render(
    <View
      testID="subject"
      style={[[{ opacity: 1 }], { opacity: 1 }, [{ opacity: 0 }]]}
    />
  );
  expect(isInaccessible(view.getByTestId('subject'))).toBe(true);
});

test('is not trigged by opacity > 0', () => {
  const view = render(<View testID="subject" style={{ opacity: 0.0001 }} />);
  expect(isInaccessible(view.getByTestId('subject'))).toBe(false);
});
