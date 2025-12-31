import * as React from 'react';
import { Modal, View } from 'react-native';

import { render, screen } from '../..';

test('toBeVisible() on empty view', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');
  expect(view).toBeVisible();
  expect(() => expect(view).not.toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeVisible()

    Received element is visible:
      <View
        testID="view"
      />"
  `);
});

test('toBeVisible() on view with opacity', () => {
  render(<View testID="view" style={{ opacity: 0.2 }} />);

  const view = screen.getByTestId('view');
  expect(view).toBeVisible();
  expect(() => expect(view).not.toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeVisible()

    Received element is visible:
      <View
        testID="view"
      />"
  `);
});

test('toBeVisible() on view with 0 opacity', () => {
  render(<View testID="view" style={{ opacity: 0 }} />);

  const view = screen.getByTestId('view');
  expect(view).not.toBeVisible();
  expect(() => expect(view).toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeVisible()

    Received element is not visible:
      <View
        style={
          {
            "opacity": 0,
          }
        }
        testID="view"
      />"
  `);
});

test('toBeVisible() on view with display "none"', () => {
  render(<View testID="view" style={{ display: 'none' }} />);

  const view = screen.getByTestId('view', { includeHiddenElements: true });
  expect(view).not.toBeVisible();
  expect(() => expect(view).toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeVisible()

    Received element is not visible:
      <View
        style={
          {
            "display": "none",
          }
        }
        testID="view"
      />"
  `);
});

test('toBeVisible() on ancestor view with 0 opacity', () => {
  render(
    <View style={{ opacity: 0 }}>
      <View>
        <View testID="view" />
      </View>
    </View>,
  );

  const view = screen.getByTestId('view');
  expect(view).not.toBeVisible();
  expect(() => expect(view).toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeVisible()

    Received element is not visible:
      <View
        testID="view"
      />"
  `);
});

test('toBeVisible() on ancestor view with display "none"', () => {
  render(
    <View style={{ display: 'none' }}>
      <View>
        <View testID="view" />
      </View>
    </View>,
  );

  const view = screen.getByTestId('view', { includeHiddenElements: true });
  expect(view).not.toBeVisible();
  expect(() => expect(view).toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeVisible()

    Received element is not visible:
      <View
        testID="view"
      />"
  `);
});

test('toBeVisible() on empty Modal', () => {
  render(<Modal testID="modal" />);

  const modal = screen.getByTestId('modal');
  expect(modal).toBeVisible();
  expect(() => expect(modal).not.toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeVisible()

    Received element is visible:
      <Modal
        testID="modal"
      />"
  `);
});

test('toBeVisible() on view within Modal', () => {
  render(
    <Modal visible>
      <View>
        <View testID="view-within-modal" />
      </View>
    </Modal>,
  );
  expect(screen.getByTestId('view-within-modal')).toBeVisible();
});

test('toBeVisible() on not visible Modal', () => {
  render(
    <Modal testID="modal" visible={false}>
      <View>
        <View testID="view-within-modal" />
      </View>
    </Modal>,
  );

  expect(screen.queryByTestId('modal')).not.toBeVisible();

  // Children elements of not visible modals are not rendered.
  expect(screen.queryByTestId('view-within-modal')).not.toBeVisible();
  expect(() => expect(screen.queryByTestId('view-within-modal')).toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).toBeVisible()

    received value must be a host element.
    Received has value: null"
  `);
});

test('toBeVisible() on inaccessible view', () => {
  render(<View testID="test" aria-hidden />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  screen.update(<View testID="test" />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view', () => {
  render(
    <View aria-hidden>
      <View>
        <View testID="test" />
      </View>
    </View>,
  );
  expect(screen.getByTestId('test', { includeHiddenElements: true })).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (iOS)', () => {
  render(<View testID="test" accessibilityElementsHidden />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  screen.update(<View testID="test" accessibilityElementsHidden={false} />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (iOS)', () => {
  render(
    <View accessibilityElementsHidden>
      <View>
        <View testID="test" />
      </View>
    </View>,
  );
  expect(screen.getByTestId('test', { includeHiddenElements: true })).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (Android)', () => {
  render(<View testID="test" importantForAccessibility="no-hide-descendants" />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  screen.update(<View testID="test" importantForAccessibility="auto" />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (Android)', () => {
  render(
    <View importantForAccessibility="no-hide-descendants">
      <View>
        <View testID="test" />
      </View>
    </View>,
  );
  expect(screen.getByTestId('test', { includeHiddenElements: true })).not.toBeVisible();
});

test('toBeVisible() on null elements', () => {
  expect(null).not.toBeVisible();
  expect(() => expect(null).toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
      "expect(received).toBeVisible()

      received value must be a host element.
      Received has value: null"
    `);
});

test('toBeVisible() on non-React elements', () => {
  expect(() =>
    expect({ name: 'Non-React element' }).not.toBeVisible(),
  ).toThrowErrorMatchingInlineSnapshot(`"Cannot read properties of undefined (reading 'style')"`);

  expect(() => expect(true).not.toBeVisible()).toThrowErrorMatchingInlineSnapshot(
    `"Invalid value used as weak map key"`,
  );
});

test('toBeVisible() does not throw on invalid style', () => {
  // @ts-expect-error: intentionally passing invalid style to
  // trigger StyleSheet.flatten() returning undefined.
  render(<View testID="view" style={0} />);

  const view = screen.getByTestId('view');
  expect(view).toBeVisible();
});
