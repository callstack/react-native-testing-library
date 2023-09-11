import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

function renderViewsWithAccessibilityValue() {
  return render(
    <>
      <View testID="min" accessibilityValue={{ min: 0 }} />
      <View testID="max" accessibilityValue={{ max: 100 }} />
      <View testID="now" accessibilityValue={{ now: 65 }} />
      <View testID="min-max" accessibilityValue={{ min: 0, max: 100 }} />
      <View
        testID="min-max-now"
        accessibilityValue={{ min: 0, max: 100, now: 65 }}
      />
      <View
        testID="min-max-now-text"
        accessibilityValue={{ text: 'test', min: 0, max: 100, now: 65 }}
      />
      <View
        testID="text"
        accessibilityValue={{ text: 'accessibility value' }}
      />
    </>
  );
}

test('toHaveAccessibilityValue() on matching accessibility value', () => {
  renderViewsWithAccessibilityValue();

  const min = screen.getByTestId('min');
  const max = screen.getByTestId('max');
  const now = screen.getByTestId('now');
  const text = screen.getByTestId('text');
  const minMax = screen.getByTestId('min-max');
  const minMaxNow = screen.getByTestId('min-max-now');
  const minMaxNowText = screen.getByTestId('min-max-now-text');

  expect(min).toHaveAccessibilityValue({ min: 0 });
  expect(max).toHaveAccessibilityValue({ max: 100 });
  expect(now).toHaveAccessibilityValue({ now: 65 });
  expect(minMax).toHaveAccessibilityValue({ min: 0, max: 100 });
  expect(minMaxNowText).toHaveAccessibilityValue({
    min: 0,
    max: 100,
    now: 65,
    text: 'test',
  });
  expect(minMaxNow).toHaveAccessibilityValue({ min: 0, max: 100, now: 65 });
  expect(text).toHaveAccessibilityValue({ text: 'accessibility value' });
  expect(text).toHaveAccessibilityValue({ text: /accessibility/i });

  expect(() => expect(min).not.toHaveAccessibilityValue({ min: 0 }))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).not.toHaveAccessibilityValue({"min": 0})

  Expected the element not to have accessibility value:
    {"min": 0}
  Received element with accessibility value:
    {"max": undefined, "min": 0, "now": undefined, "text": undefined}"
  `);

  expect(() => expect(text).toHaveAccessibilityValue({ text: 'value' }))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toHaveAccessibilityValue({"text": "value"})

  Expected the element to have accessibility value:
    {"text": "value"}
  Received element with accessibility value:
    {"max": undefined, "min": undefined, "now": undefined, "text": "accessibility value"}"
  `);

  expect(() => expect(text).toHaveAccessibilityValue({ text: /test/i }))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toHaveAccessibilityValue({"text": /test/i})

  Expected the element to have accessibility value:
    {"text": /test/i}
  Received element with accessibility value:
    {"max": undefined, "min": undefined, "now": undefined, "text": "accessibility value"}"
  `);
});

test('toHaveAccessibilityValue() on non-matching accessibility value', () => {
  renderViewsWithAccessibilityValue();

  const min = screen.getByTestId('min');
  const max = screen.getByTestId('max');
  const now = screen.getByTestId('now');
  const text = screen.getByTestId('text');
  const minMax = screen.getByTestId('min-max');
  const minMaxNow = screen.getByTestId('min-max-now');
  const minMaxNowText = screen.getByTestId('min-max-now-text');

  expect(min).not.toHaveAccessibilityValue({ min: 100 });
  expect(max).not.toHaveAccessibilityValue({ max: 0 });
  expect(now).not.toHaveAccessibilityValue({ now: 0 });
  expect(text).not.toHaveAccessibilityValue({ text: 'accessibility' });
  expect(minMax).not.toHaveAccessibilityValue({ min: 100, max: 0 });
  expect(minMaxNow).not.toHaveAccessibilityValue({ min: 100, max: 0, now: 0 });
  expect(minMaxNowText).not.toHaveAccessibilityValue({
    min: 100,
    max: 0,
    now: 0,
    text: 'accessibility',
  });

  expect(() => expect(min).toHaveAccessibilityValue({ min: 100 }))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toHaveAccessibilityValue({"min": 100})

  Expected the element to have accessibility value:
    {"min": 100}
  Received element with accessibility value:
    {"max": undefined, "min": 0, "now": undefined, "text": undefined}"
  `);
});

test('toHaveAccessibilityValue() when no accessibilityValue prop is provided', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');

  expect(() => expect(view).toHaveAccessibilityValue({ min: 0 }))
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toHaveAccessibilityValue({"min": 0})

  Expected the element to have accessibility value:
    {"min": 0}
  Received element with accessibility value:
    undefined"
  `);
});

test('toHaveAccessibilityValue() on partially matching accessibility value', () => {
  renderViewsWithAccessibilityValue();

  const minMax = screen.getByTestId('min-max');
  const minMaxNow = screen.getByTestId('min-max-now');
  const minMaxNowText = screen.getByTestId('min-max-now-text');

  expect(minMax).toHaveAccessibilityValue({ min: 0 });
  expect(minMax).toHaveAccessibilityValue({ max: 100 });
  expect(minMaxNow).toHaveAccessibilityValue({ now: 65 });
  expect(minMaxNow).toHaveAccessibilityValue({ min: 0, max: 100 });
  expect(minMaxNowText).toHaveAccessibilityValue({ text: 'test' });
  expect(minMaxNowText).toHaveAccessibilityValue({ text: /te/i });
});
