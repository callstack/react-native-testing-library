import * as React from 'react';
import { View, Text } from 'react-native';
import { render } from '../..';

describe('accessibility value', () => {
  test('matches using all value props', () => {
    const { getByRole, queryByRole } = render(
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: 100, now: 50, text: '50%' }}
      />
    );

    expect(
      getByRole('adjustable', {
        value: { min: 0, max: 100, now: 50, text: '50%' },
      })
    ).toBeTruthy();
    expect(
      queryByRole('adjustable', {
        value: { min: 1, max: 100, now: 50, text: '50%' },
      })
    ).toBeFalsy();
    expect(
      queryByRole('adjustable', {
        value: { min: 0, max: 99, now: 50, text: '50%' },
      })
    ).toBeFalsy();
    expect(
      queryByRole('adjustable', {
        value: { min: 0, max: 100, now: 45, text: '50%' },
      })
    ).toBeFalsy();
    expect(
      queryByRole('adjustable', {
        value: { min: 0, max: 100, now: 50, text: '55%' },
      })
    ).toBeFalsy();
  });

  test('matches using single value', () => {
    const { getByRole, queryByRole } = render(
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 10, max: 20, now: 12, text: 'Hello' }}
      />
    );

    expect(getByRole('adjustable', { value: { min: 10 } })).toBeTruthy();
    expect(getByRole('adjustable', { value: { max: 20 } })).toBeTruthy();
    expect(getByRole('adjustable', { value: { now: 12 } })).toBeTruthy();
    expect(getByRole('adjustable', { value: { text: 'Hello' } })).toBeTruthy();
    expect(getByRole('adjustable', { value: { text: /hello/i } })).toBeTruthy();

    expect(queryByRole('adjustable', { value: { min: 11 } })).toBeFalsy();
    expect(queryByRole('adjustable', { value: { max: 19 } })).toBeFalsy();
    expect(queryByRole('adjustable', { value: { now: 15 } })).toBeFalsy();
    expect(queryByRole('adjustable', { value: { text: 'No' } })).toBeFalsy();
    expect(queryByRole('adjustable', { value: { text: /no/ } })).toBeFalsy();
  });

  test('matches using single value and other options', () => {
    const { getByRole } = render(
      <Text
        accessibilityRole="adjustable"
        accessibilityState={{ disabled: true }}
        accessibilityValue={{ min: 10, max: 20, now: 12, text: 'Hello' }}
      >
        Hello
      </Text>
    );

    expect(
      getByRole('adjustable', { name: 'Hello', value: { min: 10 } })
    ).toBeTruthy();
    expect(
      getByRole('adjustable', { disabled: true, value: { min: 10 } })
    ).toBeTruthy();

    expect(() => getByRole('adjustable', { name: 'Hello', value: { min: 5 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", name: "Hello", min value: 5

      <Text
        accessibilityRole="adjustable"
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessibilityValue={
          {
            "max": 20,
            "min": 10,
            "now": 12,
            "text": "Hello",
          }
        }
      >
        Hello
      </Text>"
    `);
    expect(() => getByRole('adjustable', { name: 'World', value: { min: 10 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", name: "World", min value: 10

      <Text
        accessibilityRole="adjustable"
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessibilityValue={
          {
            "max": 20,
            "min": 10,
            "now": 12,
            "text": "Hello",
          }
        }
      >
        Hello
      </Text>"
    `);
    expect(() => getByRole('adjustable', { name: 'Hello', value: { min: 5 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", name: "Hello", min value: 5

      <Text
        accessibilityRole="adjustable"
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessibilityValue={
          {
            "max": 20,
            "min": 10,
            "now": 12,
            "text": "Hello",
          }
        }
      >
        Hello
      </Text>"
    `);
    expect(() =>
      getByRole('adjustable', { selected: true, value: { min: 10 } })
    ).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: "adjustable", selected state: true, min value: 10

      <Text
        accessibilityRole="adjustable"
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessibilityValue={
          {
            "max": 20,
            "min": 10,
            "now": 12,
            "text": "Hello",
          }
        }
      >
        Hello
      </Text>"
    `);
  });
});
