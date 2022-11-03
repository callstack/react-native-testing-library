import * as React from 'react';
import { View } from 'react-native';
import { render } from '../..';

describe('accessibility value', () => {
  test('matches using all value props', () => {
    const { getByRole, queryByRole } = render(
      <View
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
});
