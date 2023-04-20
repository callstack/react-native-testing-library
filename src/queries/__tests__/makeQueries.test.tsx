import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import { render, screen } from '../..';

describe('printing element tree', () => {
  test('includes element tree on error with less-helpful props stripped', async () => {
    const { getByText } = render(<Text onPress={() => null}>Some text</Text>);

    expect(() => getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <Text>
        Some text
      </Text>"
    `);
  });

  test('prints helpful props but not others', async () => {
    const { getByText } = render(
      <View
        accessibilityElementsHidden
        accessibilityViewIsModal
        importantForAccessibility="yes"
        testID="TEST_ID"
        nativeID="NATIVE_ID"
        accessibilityLabel="LABEL"
        accessibilityLabelledBy="LABELLED_BY"
        accessibilityRole="summary"
        accessibilityHint="HINT"
        key="this is filtered"
      >
        <TextInput
          placeholder="PLACEHOLDER"
          value="VALUE"
          defaultValue="DEFAULT_VALUE"
        />
        <Text>Some Text</Text>
      </View>
    );

    expect(() => getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityElementsHidden={true}
        accessibilityHint="HINT"
        accessibilityLabel="LABEL"
        accessibilityLabelledBy="LABELLED_BY"
        accessibilityRole="summary"
        accessibilityViewIsModal={true}
        importantForAccessibility="yes"
        nativeID="NATIVE_ID"
        testID="TEST_ID"
      >
        <TextInput
          defaultValue="DEFAULT_VALUE"
          placeholder="PLACEHOLDER"
          value="VALUE"
        />
        <Text>
          Some Text
        </Text>
      </View>"
    `);
  });

  test('prints tree and filters props with getAllBy, findBy, findAllBy', async () => {
    const { getAllByText, findByText, findAllByText } = render(
      <View accessibilityViewIsModal key="this is filtered" />
    );

    expect(() => getAllByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

    await expect(findByText(/foo/)).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

    await expect(() => findAllByText(/foo/)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);
  });

  // the stack is what actually gets printed to the console, so we need to
  // ensure that the element tree is in the stack and not just in the message
  test('when findBy fails, includes element tree in stack, not just message', async () => {
    const { findByText } = render(<View />);

    let error: Error = new Error();

    try {
      await findByText(/foo/);
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.stack).toMatch(/<View/);
    }
  });

  // the stack is what actually gets printed to the console, so we need to
  // ensure that the element tree is in the stack and not just in the message
  test('when findAllBy fails, includes element tree in stack, not just message', async () => {
    const { findAllByText } = render(<View />);

    let error: Error = new Error();

    try {
      await findAllByText(/foo/);
    } catch (e) {
      error = e as Error;
    } finally {
      expect(error?.stack).toMatch(/<View \/>/);
    }
  });

  test('only appends element tree on last failure with findBy', async () => {
    const { findByText } = render(
      <View accessibilityViewIsModal key="this is filtered" />
    );

    jest.spyOn(screen, 'toJSON');

    await expect(() => findByText(/foo/)).rejects.toThrow();

    expect(screen.toJSON).toHaveBeenCalledTimes(1);
  });

  test('custom onTimeout with findBy receives error without element tree', async () => {
    expect.assertions(3);
    const { findByText } = render(<View />);

    const onTimeout = jest.fn((e: unknown) => {
      const error = e as Error;
      // does not include the element tree
      expect(error.message).not.toMatch(/View/);
      return error;
    });

    await expect(() =>
      findByText(/foo/, undefined, { onTimeout })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Unable to find an element with text: /foo/"`
    );

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  test('custom onTimeout with findAllBy receives error without element tree', async () => {
    expect.assertions(3);
    const { findAllByText } = render(<View />);

    const onTimeout = jest.fn((e: unknown) => {
      const error = e as Error;
      // does not include the element tree
      expect(error.message).not.toMatch(/View/);
      return error;
    });

    await expect(() =>
      findAllByText(/foo/, undefined, { onTimeout })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Unable to find an element with text: /foo/"`
    );

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  test('does not strip display: none from "style" prop, but does strip other styles', () => {
    const { getByText } = render(
      <View style={{ display: 'flex', position: 'absolute' }}>
        <Text
          style={[
            { display: 'flex', position: 'relative' },
            { display: 'none', flex: 1 },
          ]}
        >
          Some text
        </Text>
      </View>
    );

    expect(() => getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View>
        <Text
          style={
            Object {
              "display": "none",
            }
          }
        >
          Some text
        </Text>
      </View>"
    `);
  });

  test('strips undefined values from accessibilityState', () => {
    const { getByText } = render(
      <View accessibilityState={{ checked: true, busy: false }}>
        <View accessibilityState={{ checked: undefined }} />
      </View>
    );

    expect(() => getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityState={
          Object {
            "busy": false,
            "checked": true,
          }
        }
      >
        <View />
      </View>"
    `);
  });

  test('strips undefined values from accessibilityValue', () => {
    const { getByText } = render(
      <View accessibilityValue={{ min: 1 }}>
        <View accessibilityState={{}} />
      </View>
    );

    expect(() => getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityValue={
          Object {
            "min": 1,
          }
        }
      >
        <View />
      </View>"
    `);
  });
});
