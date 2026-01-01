import * as React from 'react';
import { Text, TextInput, View } from 'react-native';

import { render, screen } from '../..';

describe('printing element tree', () => {
  test('includes element tree on error with less-helpful props stripped', () => {
    render(<Text onPress={() => null}>Some text</Text>);

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <Text>
          Some text
        </Text>
      </>"
    `);
  });

  test('prints helpful props but not others', () => {
    render(
      <View
        key="this is filtered"
        testID="TEST_ID"
        nativeID="NATIVE_ID"
        accessibilityElementsHidden
        accessibilityLabel="LABEL"
        accessibilityLabelledBy="LABELLED_BY"
        accessibilityHint="HINT"
        accessibilityRole="summary"
        accessibilityViewIsModal
        aria-busy={false}
        aria-checked="mixed"
        aria-disabled={false}
        aria-expanded={false}
        aria-hidden
        aria-label="ARIA_LABEL"
        aria-labelledby="ARIA_LABELLED_BY"
        aria-modal
        aria-selected={false}
        aria-valuemin={10}
        aria-valuemax={30}
        aria-valuenow={20}
        aria-valuetext="Hello Value"
        importantForAccessibility="yes"
        role="summary"
      >
        <TextInput placeholder="PLACEHOLDER" value="VALUE" defaultValue="DEFAULT_VALUE" />
        <Text>Some Text</Text>
      </View>,
    );

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityElementsHidden={true}
          accessibilityHint="HINT"
          accessibilityLabel="LABEL"
          accessibilityLabelledBy="LABELLED_BY"
          accessibilityRole="summary"
          accessibilityViewIsModal={true}
          aria-busy={false}
          aria-checked="mixed"
          aria-disabled={false}
          aria-expanded={false}
          aria-hidden={true}
          aria-label="ARIA_LABEL"
          aria-labelledby="ARIA_LABELLED_BY"
          aria-modal={true}
          aria-selected={false}
          aria-valuemax={30}
          aria-valuemin={10}
          aria-valuenow={20}
          aria-valuetext="Hello Value"
          importantForAccessibility="yes"
          nativeID="NATIVE_ID"
          role="summary"
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
        </View>
      </>"
    `);
  });

  test('prints tree and filters props with getBy, getAllBy, findBy, findAllBy', async () => {
    render(<View accessibilityViewIsModal key="this is filtered" />);

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityViewIsModal={true}
        />
      </>"
    `);

    expect(() => screen.getAllByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityViewIsModal={true}
        />
      </>"
    `);

    await expect(screen.findByText(/foo/)).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityViewIsModal={true}
        />
      </>"
    `);

    await expect(screen.findAllByText(/foo/)).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityViewIsModal={true}
        />
      </>"
    `);
  });

  test('only appends element tree on last failure with findBy', async () => {
    render(<View accessibilityViewIsModal key="this is filtered" />);

    jest.spyOn(screen, 'toJSON');

    await expect(screen.findByText(/foo/)).rejects.toThrow();

    expect(screen.toJSON).toHaveBeenCalledTimes(1);
  });

  test('onTimeout with findBy receives error without element tree', async () => {
    render(<View />);

    const onTimeout = jest.fn((_: Error) => new Error('Replacement error'));

    await expect(() =>
      screen.findByText(/foo/, undefined, { onTimeout }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Replacement error"`);

    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(onTimeout.mock.calls[0][0].message).not.toMatch(/View/);
    expect(onTimeout.mock.calls[0][0].message).toMatchInlineSnapshot(
      `"Unable to find an element with text: /foo/"`,
    );
  });

  test('onTimeout with findAllBy receives error without element tree', async () => {
    render(<View />);

    const onTimeout = jest.fn((_: Error) => new Error('Replacement error'));

    await expect(() =>
      screen.findAllByText(/foo/, undefined, { onTimeout }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Replacement error"`);

    expect(onTimeout).toHaveBeenCalledTimes(1);
    expect(onTimeout.mock.calls[0][0].message).not.toMatch(/View/);
    expect(onTimeout.mock.calls[0][0].message).toMatchInlineSnapshot(
      `"Unable to find an element with text: /foo/"`,
    );
  });

  test('does not strip display: none from "style" prop, but does strip other styles', () => {
    render(
      <View style={{ display: 'flex', position: 'absolute' }}>
        <Text
          style={[
            { display: 'flex', position: 'relative' },
            { display: 'none', flex: 1 },
          ]}
        >
          Some text
        </Text>
      </View>,
    );

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
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
        </View>
      </>"
    `);
  });

  test('strips undefined values from accessibilityState', () => {
    render(
      <View accessibilityState={{ checked: true, busy: false }}>
        <View accessibilityState={{ checked: undefined }} />
      </View>,
    );

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityState={
            {
              "busy": false,
              "checked": true,
            }
          }
        >
          <View />
        </View>
      </>"
    `);
  });

  test('strips undefined values from accessibilityValue', () => {
    render(
      <View accessibilityValue={{ min: 1 }}>
        <View accessibilityState={{}} />
      </View>,
    );

    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: /foo/

      <>
        <View
          accessibilityValue={
            {
              "min": 1,
            }
          }
        >
          <View />
        </View>
      </>"
    `);
  });

  test('does not render element tree when toJSON() returns null', () => {
    render(<View />);

    jest.spyOn(screen, 'toJSON').mockImplementation(() => null);
    expect(() => screen.getByText(/foo/)).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find an element with text: /foo/"`,
    );
  });
});
