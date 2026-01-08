import * as React from 'react';
import { Modal, View } from 'react-native';

import { render, screen } from '../..';

test('toBeVisible() on empty view', async () => {
  await render(<View testID="view" />);

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

test('toBeVisible() on view with opacity', async () => {
  await render(<View testID="view" style={{ opacity: 0.2 }} />);

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

test('toBeVisible() on view with 0 opacity', async () => {
  await render(<View testID="view" style={{ opacity: 0 }} />);

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

test('toBeVisible() on view with display "none"', async () => {
  await render(<View testID="view" style={{ display: 'none' }} />);

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

test('toBeVisible() on ancestor view with 0 opacity', async () => {
  await render(
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

test('toBeVisible() on ancestor view with display "none"', async () => {
  await render(
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

test('toBeVisible() on empty Modal', async () => {
  await render(<Modal testID="modal" />);

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

test('toBeVisible() on view within Modal', async () => {
  await render(
    <Modal visible>
      <View>
        <View testID="view-within-modal" />
      </View>
    </Modal>,
  );
  expect(screen.getByTestId('view-within-modal')).toBeVisible();
});

test('toBeVisible() on not visible Modal', async () => {
  await render(
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

test('toBeVisible() on inaccessible view', async () => {
  await render(<View testID="test" aria-hidden />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  await screen.rerender(<View testID="test" />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view', async () => {
  await render(
    <View aria-hidden>
      <View>
        <View testID="test" />
      </View>
    </View>,
  );
  expect(screen.getByTestId('test', { includeHiddenElements: true })).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (iOS)', async () => {
  await render(<View testID="test" accessibilityElementsHidden />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  await screen.rerender(<View testID="test" accessibilityElementsHidden={false} />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (iOS)', async () => {
  await render(
    <View accessibilityElementsHidden>
      <View>
        <View testID="test" />
      </View>
    </View>,
  );
  expect(screen.getByTestId('test', { includeHiddenElements: true })).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (Android)', async () => {
  await render(<View testID="test" importantForAccessibility="no-hide-descendants" />);

  const test = screen.getByTestId('test', { includeHiddenElements: true });
  expect(test).not.toBeVisible();

  await screen.rerender(<View testID="test" importantForAccessibility="auto" />);
  expect(test).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (Android)', async () => {
  await render(
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
  expect(() => expect({ name: 'Non-React element' }).not.toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
      "expect(received).not.toBeVisible()

      received value must be a host element.
      Received has type:  object
      Received has value: {"name": "Non-React element"}"
    `);

  expect(() => expect(true).not.toBeVisible()).toThrowErrorMatchingInlineSnapshot(`
      "expect(received).not.toBeVisible()

      received value must be a host element.
      Received has type:  boolean
      Received has value: true"
    `);
});

test('toBeVisible() does not throw on invalid style', async () => {
  // @ts-expect-error: intentionally passing invalid style to
  // trigger StyleSheet.flatten() returning undefined.
  await render(<View testID="view" style={0} />);

  const view = screen.getByTestId('view');
  expect(view).toBeVisible();
});
