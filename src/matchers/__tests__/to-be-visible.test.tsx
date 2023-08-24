import * as React from 'react';
import { View, Modal } from 'react-native';
import { render } from '../..';
import '../extend-expect';

test('toBeVisible() on empty view', () => {
  const { getByTestId } = render(<View testID="test" />);
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view with opacity', () => {
  const { getByTestId } = render(
    <View testID="test" style={{ opacity: 0.2 }} />
  );
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view with 0 opacity', () => {
  const { getByTestId } = render(<View testID="test" style={{ opacity: 0 }} />);
  expect(getByTestId('test')).not.toBeVisible();
});

test('toBeVisible() on view with display "none"', () => {
  const { getByTestId } = render(
    <View testID="test" style={{ display: 'none' }} />
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on ancestor view with 0 opacity', () => {
  const { getByTestId } = render(
    <View style={{ opacity: 0 }}>
      <View>
        <View testID="test" />
      </View>
    </View>
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on ancestor view with display "none"', () => {
  const { getByTestId } = render(
    <View style={{ display: 'none' }}>
      <View>
        <View testID="test" />
      </View>
    </View>
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on empty Modal', () => {
  const { getByTestId } = render(<Modal testID="test" />);
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view within Modal', () => {
  const { getByTestId } = render(
    <Modal visible>
      <View>
        <View testID="view-within-modal" />
      </View>
    </Modal>
  );
  expect(getByTestId('view-within-modal')).toBeVisible();
});

test('toBeVisible() on view within not visible Modal', () => {
  const { getByTestId, queryByTestId } = render(
    <Modal testID="test" visible={false}>
      <View>
        <View testID="view-within-modal" />
      </View>
    </Modal>
  );

  expect(getByTestId('test')).not.toBeVisible();

  // Children elements of not visible modals are not rendered.
  expect(() => expect(getByTestId('view-within-modal')).not.toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with testID: view-within-modal

      <Modal
        testID="test"
      />"
    `);
  expect(queryByTestId('view-within-modal')).toBeNull();
});

test('toBeVisible() on not visible Modal', () => {
  const { getByTestId } = render(<Modal testID="test" visible={false} />);

  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on inaccessible view', () => {
  const { getByTestId, update } = render(
    <View testID="test" aria-hidden={true} />
  );

  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();

  update(<View testID="test" />);
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view within inaccessible view', () => {
  const { getByTestId } = render(
    <View aria-hidden={true}>
      <View>
        <View testID="test" />
      </View>
    </View>
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (iOS)', () => {
  const { getByTestId, update } = render(
    <View testID="test" accessibilityElementsHidden />
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();

  update(<View testID="test" accessibilityElementsHidden={false} />);
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (iOS)', () => {
  const { getByTestId } = render(
    <View accessibilityElementsHidden>
      <View>
        <View testID="test" />
      </View>
    </View>
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on inaccessible view (Android)', () => {
  const { getByTestId, update } = render(
    <View testID="test" importantForAccessibility="no-hide-descendants" />
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();

  update(<View testID="test" importantForAccessibility="auto" />);
  expect(getByTestId('test')).toBeVisible();
});

test('toBeVisible() on view within inaccessible view (Android)', () => {
  const { getByTestId } = render(
    <View importantForAccessibility="no-hide-descendants">
      <View>
        <View testID="test" />
      </View>
    </View>
  );
  expect(
    getByTestId('test', { includeHiddenElements: true })
  ).not.toBeVisible();
});

test('toBeVisible() on null elements', () => {
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
  expect(() => expect(true).not.toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(received).not.toBeVisible()

  received value must be a host element.
  Received has type:  boolean
  Received has value: true"
  `);
});

test('toBeVisible() throws an error when expectation is not matched', () => {
  const { getByTestId, update } = render(<View testID="test" />);
  expect(() => expect(getByTestId('test')).not.toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).not.toBeVisible()

  Received element is visible:
    <View
      testID="test"
    />"
  `);

  update(<View testID="test" style={{ opacity: 0 }} />);
  expect(() => expect(getByTestId('test')).toBeVisible())
    .toThrowErrorMatchingInlineSnapshot(`
  "expect(element).toBeVisible()

  Received element is not visible:
    <View
      style={
        {
          "opacity": 0,
        }
      }
      testID="test"
    />"
  `);
});
