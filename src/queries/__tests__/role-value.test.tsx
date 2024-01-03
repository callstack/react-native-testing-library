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

    expect(getByRole('adjustable', { name: 'Hello', value: { min: 10 } })).toBeTruthy();
    expect(getByRole('adjustable', { disabled: true, value: { min: 10 } })).toBeTruthy();

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
    expect(() => getByRole('adjustable', { selected: true, value: { min: 10 } }))
      .toThrowErrorMatchingInlineSnapshot(`
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

  test('supports "aria-valuemax" prop', () => {
    const screen = render(<View accessible role="slider" aria-valuemax={10} />);
    expect(screen.getByRole('slider', { value: { max: 10 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { max: 20 } })).toBeNull();
  });

  test('supports "aria-valuemin" prop', () => {
    const screen = render(<View accessible role="slider" aria-valuemin={20} />);
    expect(screen.getByRole('slider', { value: { min: 20 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { min: 30 } })).toBeNull();
  });

  test('supports "aria-valuenow" prop', () => {
    const screen = render(<View accessible role="slider" aria-valuenow={30} />);
    expect(screen.getByRole('slider', { value: { now: 30 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { now: 10 } })).toBeNull();
  });

  test('supports "aria-valuetext" prop', () => {
    const screen = render(<View accessible role="slider" aria-valuetext="Hello World" />);
    expect(screen.getByRole('slider', { value: { text: 'Hello World' } })).toBeTruthy();
    expect(screen.getByRole('slider', { value: { text: /hello/i } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { text: 'Hello' } })).toBeNull();
    expect(screen.queryByRole('slider', { value: { text: /salut/i } })).toBeNull();
  });

  test('supports multiple "aria-value*" props', () => {
    const screen = render(
      <View accessible role="slider" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
    );
    expect(screen.getByRole('slider', { value: { now: 50, min: 0, max: 100 } })).toBeTruthy();
  });
});
