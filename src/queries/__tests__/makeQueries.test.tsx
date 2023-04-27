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

  test('prints tree and filters props with getBy, getAllBy, findBy, findAllBy', async () => {
    const view = render(
      <View accessibilityViewIsModal key="this is filtered" />
    );

    expect(() => view.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

    expect(() => view.getAllByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

    await expect(view.findByText(/foo/)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);

    await expect(view.findAllByText(/foo/)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <View
        accessibilityViewIsModal={true}
      />"
    `);
  });

  test('only appends element tree on last failure with findBy', async () => {
    const { findByText } = render(
      <View accessibilityViewIsModal key="this is filtered" />
    );

    jest.spyOn(screen, 'toJSON');

    await expect(findByText(/foo/)).rejects.toThrow();

    expect(screen.toJSON).toHaveBeenCalledTimes(1);
  });

  test('onTimeout with findBy receives error without element tree', async () => {
    const { findByText } = render(<View />);

    const onTimeout = jest.fn((_: Error) => new Error('Replacement error'));

    await expect(() =>
      findByText(/foo/, undefined, { onTimeout })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Replacement error"`);

    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(onTimeout.mock.calls[0][0].message).not.toMatch(/View/);
    expect(onTimeout.mock.calls[0][0].message).toMatchInlineSnapshot(
      `"Unable to find an element with text: /foo/"`
    );
  });

  test('onTimeout with findAllBy receives error without element tree', async () => {
    const { findAllByText } = render(<View />);

    const onTimeout = jest.fn((_: Error) => new Error('Replacement error'));

    await expect(() =>
      findAllByText(/foo/, undefined, { onTimeout })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Replacement error"`);

    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(onTimeout.mock.calls[0][0].message).not.toMatch(/View/);
    expect(onTimeout.mock.calls[0][0].message).toMatchInlineSnapshot(
      `"Unable to find an element with text: /foo/"`
    );
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
            {
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
          {
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
          {
            "min": 1,
          }
        }
      >
        <View />
      </View>"
    `);
  });

  test('does not render element tree when toJSON() returns null', () => {
    const view = render(<View />);

    jest.spyOn(screen, 'toJSON').mockImplementation(() => null);
    expect(() => view.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find an element with text: /foo/"`
    );
  });
});
