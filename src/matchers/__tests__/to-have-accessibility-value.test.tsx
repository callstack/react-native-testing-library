import * as React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';

describe('toHaveAccessibilityValue', () => {
  it('supports "accessibilityValue.min"', async () => {
    await render(<View accessibilityValue={{ min: 0 }} />);
    expect(screen.root).toHaveAccessibilityValue({ min: 0 });
    expect(screen.root).not.toHaveAccessibilityValue({ min: 1 });
  });

  it('supports "accessibilityValue.max"', async () => {
    await render(<View accessibilityValue={{ max: 100 }} />);
    expect(screen.root).toHaveAccessibilityValue({ max: 100 });
    expect(screen.root).not.toHaveAccessibilityValue({ max: 99 });
  });

  it('supports "accessibilityValue.now"', async () => {
    await render(<View accessibilityValue={{ now: 33 }} />);
    expect(screen.root).toHaveAccessibilityValue({ now: 33 });
    expect(screen.root).not.toHaveAccessibilityValue({ now: 34 });
  });

  it('supports "accessibilityValue.text"', async () => {
    await render(<View testID="view" accessibilityValue={{ text: 'Hello' }} />);
    expect(screen.root).toHaveAccessibilityValue({ text: 'Hello' });
    expect(screen.root).toHaveAccessibilityValue({ text: /He/ });
    expect(screen.root).not.toHaveAccessibilityValue({ text: 'Hi' });
    expect(screen.root).not.toHaveAccessibilityValue({ text: /Hi/ });
  });

  it('supports "aria-valuemin"', async () => {
    await render(<View testID="view" aria-valuemin={0} />);
    expect(screen.root).toHaveAccessibilityValue({ min: 0 });
    expect(screen.root).not.toHaveAccessibilityValue({ min: 1 });
  });

  it('supports "aria-valuemax"', async () => {
    await render(<View testID="view" aria-valuemax={100} />);
    expect(screen.root).toHaveAccessibilityValue({ max: 100 });
    expect(screen.root).not.toHaveAccessibilityValue({ max: 99 });
  });

  it('supports "aria-valuenow"', async () => {
    await render(<View testID="view" aria-valuenow={33} />);
    expect(screen.root).toHaveAccessibilityValue({ now: 33 });
    expect(screen.root).not.toHaveAccessibilityValue({ now: 34 });
  });

  it('supports "aria-valuetext"', async () => {
    await render(<View testID="view" aria-valuetext="Hello" />);
    expect(screen.root).toHaveAccessibilityValue({ text: 'Hello' });
    expect(screen.root).toHaveAccessibilityValue({ text: /He/ });
    expect(screen.root).not.toHaveAccessibilityValue({ text: 'Hi' });
    expect(screen.root).not.toHaveAccessibilityValue({ text: /Hi/ });
  });

  it('supports multi-argument matching', async () => {
    await render(<View accessibilityValue={{ min: 1, max: 10, now: 5, text: '5/10' }} />);

    expect(screen.root).toHaveAccessibilityValue({ now: 5 });
    expect(screen.root).toHaveAccessibilityValue({ now: 5, min: 1 });
    expect(screen.root).toHaveAccessibilityValue({ now: 5, max: 10 });
    expect(screen.root).toHaveAccessibilityValue({ now: 5, min: 1, max: 10 });
    expect(screen.root).toHaveAccessibilityValue({ text: '5/10' });
    expect(screen.root).toHaveAccessibilityValue({ now: 5, text: '5/10' });
    expect(screen.root).toHaveAccessibilityValue({
      now: 5,
      min: 1,
      max: 10,
      text: '5/10',
    });

    expect(screen.root).not.toHaveAccessibilityValue({ now: 6 });
    expect(screen.root).not.toHaveAccessibilityValue({ now: 5, min: 0 });
    expect(screen.root).not.toHaveAccessibilityValue({ now: 5, max: 9 });
    expect(screen.root).not.toHaveAccessibilityValue({
      now: 5,
      min: 1,
      max: 10,
      text: '5 of 10',
    });
  });

  it('gives precedence to ARIA values', async () => {
    await render(
      <View
        testID="view"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={33}
        aria-valuetext="Hello"
        accessibilityValue={{ min: 10, max: 90, now: 30, text: 'Hi' }}
      />,
    );

    expect(screen.root).toHaveAccessibilityValue({ min: 0 });
    expect(screen.root).toHaveAccessibilityValue({ max: 100 });
    expect(screen.root).toHaveAccessibilityValue({ now: 33 });
    expect(screen.root).toHaveAccessibilityValue({ text: 'Hello' });

    expect(screen.root).not.toHaveAccessibilityValue({ min: 10 });
    expect(screen.root).not.toHaveAccessibilityValue({ max: 90 });
    expect(screen.root).not.toHaveAccessibilityValue({ now: 30 });
    expect(screen.root).not.toHaveAccessibilityValue({ text: 'Hi' });
  });

  it('shows errors in expected format', async () => {
    await render(
      <View
        testID="view"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={33}
        aria-valuetext="Hello"
      />,
    );

    expect(() => expect(screen.root).toHaveAccessibilityValue({ min: 10 }))
      .toThrowErrorMatchingInlineSnapshot(`
      "expect(element).toHaveAccessibilityValue({"min": 10})

      Expected the element to have accessibility value:
        {"min": 10}
      Received element with accessibility value:
        {"max": 100, "min": 0, "now": 33, "text": "Hello"}"
    `);

    expect(() => expect(screen.root).not.toHaveAccessibilityValue({ min: 0 }))
      .toThrowErrorMatchingInlineSnapshot(`
      "expect(element).not.toHaveAccessibilityValue({"min": 0})

      Expected the element not to have accessibility value:
        {"min": 0}
      Received element with accessibility value:
        {"max": 100, "min": 0, "now": 33, "text": "Hello"}"
    `);
  });

  it('shows errors in expected format with partial value', async () => {
    await render(<View testID="view" aria-valuenow={33} aria-valuetext="Hello" />);

    expect(() => expect(screen.root).toHaveAccessibilityValue({ min: 30 }))
      .toThrowErrorMatchingInlineSnapshot(`
      "expect(element).toHaveAccessibilityValue({"min": 30})

      Expected the element to have accessibility value:
        {"min": 30}
      Received element with accessibility value:
        {"now": 33, "text": "Hello"}"
    `);

    expect(() => expect(screen.root).not.toHaveAccessibilityValue({ now: 33 }))
      .toThrowErrorMatchingInlineSnapshot(`
      "expect(element).not.toHaveAccessibilityValue({"now": 33})

      Expected the element not to have accessibility value:
        {"now": 33}
      Received element with accessibility value:
        {"now": 33, "text": "Hello"}"
    `);
  });
});
