import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '../..';

describe('accessibility value', () => {
  test('matches using all value props', () => {
    render(
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 0, max: 100, now: 50, text: '50%' }}
      />,
    );

    expect(
      screen.getByRole('adjustable', {
        value: { min: 0, max: 100, now: 50, text: '50%' },
      }),
    ).toBeTruthy();
    expect(
      screen.queryByRole('adjustable', {
        value: { min: 1, max: 100, now: 50, text: '50%' },
      }),
    ).toBeFalsy();
    expect(
      screen.queryByRole('adjustable', {
        value: { min: 0, max: 99, now: 50, text: '50%' },
      }),
    ).toBeFalsy();
    expect(
      screen.queryByRole('adjustable', {
        value: { min: 0, max: 100, now: 45, text: '50%' },
      }),
    ).toBeFalsy();
    expect(
      screen.queryByRole('adjustable', {
        value: { min: 0, max: 100, now: 50, text: '55%' },
      }),
    ).toBeFalsy();
  });

  test('matches using single value', () => {
    render(
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min: 10, max: 20, now: 12, text: 'Hello' }}
      />,
    );

    expect(screen.getByRole('adjustable', { value: { min: 10 } })).toBeTruthy();
    expect(screen.getByRole('adjustable', { value: { max: 20 } })).toBeTruthy();
    expect(screen.getByRole('adjustable', { value: { now: 12 } })).toBeTruthy();
    expect(screen.getByRole('adjustable', { value: { text: 'Hello' } })).toBeTruthy();
    expect(screen.getByRole('adjustable', { value: { text: /hello/i } })).toBeTruthy();

    expect(screen.queryByRole('adjustable', { value: { min: 11 } })).toBeFalsy();
    expect(screen.queryByRole('adjustable', { value: { max: 19 } })).toBeFalsy();
    expect(screen.queryByRole('adjustable', { value: { now: 15 } })).toBeFalsy();
    expect(screen.queryByRole('adjustable', { value: { text: 'No' } })).toBeFalsy();
    expect(screen.queryByRole('adjustable', { value: { text: /no/ } })).toBeFalsy();
  });

  test('matches using single value and other options', () => {
    render(
      <Text
        accessibilityRole="adjustable"
        accessibilityState={{ disabled: true }}
        accessibilityValue={{ min: 10, max: 20, now: 12, text: 'Hello' }}
      >
        Hello
      </Text>,
    );

    expect(screen.getByRole('adjustable', { name: 'Hello', value: { min: 10 } })).toBeTruthy();
    expect(screen.getByRole('adjustable', { disabled: true, value: { min: 10 } })).toBeTruthy();

    expect(() => screen.getByRole('adjustable', { name: 'Hello', value: { min: 5 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: adjustable, name: Hello, min value: 5

      <RntlContainer>
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
        </Text>
      </RntlContainer>"
    `);
    expect(() => screen.getByRole('adjustable', { name: 'World', value: { min: 10 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: adjustable, name: World, min value: 10

      <RntlContainer>
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
        </Text>
      </RntlContainer>"
    `);
    expect(() => screen.getByRole('adjustable', { name: 'Hello', value: { min: 5 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: adjustable, name: Hello, min value: 5

      <RntlContainer>
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
        </Text>
      </RntlContainer>"
    `);
    expect(() => screen.getByRole('adjustable', { selected: true, value: { min: 10 } }))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with role: adjustable, selected state: true, min value: 10

      <RntlContainer>
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
        </Text>
      </RntlContainer>"
    `);
  });

  test('supports "aria-valuemax" prop', () => {
    render(<View accessible role="slider" aria-valuemax={10} />);
    expect(screen.getByRole('slider', { value: { max: 10 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { max: 20 } })).toBeNull();
  });

  test('supports "aria-valuemin" prop', () => {
    render(<View accessible role="slider" aria-valuemin={20} />);
    expect(screen.getByRole('slider', { value: { min: 20 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { min: 30 } })).toBeNull();
  });

  test('supports "aria-valuenow" prop', () => {
    render(<View accessible role="slider" aria-valuenow={30} />);
    expect(screen.getByRole('slider', { value: { now: 30 } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { now: 10 } })).toBeNull();
  });

  test('supports "aria-valuetext" prop', () => {
    render(<View accessible role="slider" aria-valuetext="Hello World" />);
    expect(screen.getByRole('slider', { value: { text: 'Hello World' } })).toBeTruthy();
    expect(screen.getByRole('slider', { value: { text: /hello/i } })).toBeTruthy();
    expect(screen.queryByRole('slider', { value: { text: 'Hello' } })).toBeNull();
    expect(screen.queryByRole('slider', { value: { text: /salut/i } })).toBeNull();
  });

  test('supports multiple "aria-value*" props', () => {
    render(
      <View accessible role="slider" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />,
    );
    expect(screen.getByRole('slider', { value: { now: 50, min: 0, max: 100 } })).toBeTruthy();
  });
});
