import React from 'react';
import { type AccessibilityRole, View } from 'react-native';
import render from '../../render';
import { screen } from '../../screen';
import '../extend-expect';

const ViewWithRole = ({ role }: { role: AccessibilityRole }) => {
  return (
    <>
      <View
        testID={`${role}-checked`}
        accessible
        accessibilityRole={role}
        accessibilityState={{ checked: true }}
      />
      <View
        testID={`${role}-unchecked`}
        accessible
        accessibilityRole={role}
        accessibilityState={{ checked: false }}
      />
      <View
        testID={`${role}-mixChecked`}
        accessible
        accessibilityRole={role}
        accessibilityState={{ checked: 'mixed' }}
      />
    </>
  );
};

test('toBeCheck() with checkbox role', () => {
  render(<ViewWithRole role="checkbox" />);

  const checkedView = screen.getByTestId('checkbox-checked');
  const unCheckedView = screen.getByTestId('checkbox-unchecked');
  const partiallyCheckedView = screen.getByTestId('checkbox-mixChecked');
  expect(checkedView).toBeChecked();
  expect(unCheckedView).not.toBeChecked();
  expect(partiallyCheckedView).toBePartiallyChecked();

  expect(() => expect(checkedView).not.toBeChecked()).toThrow();
  expect(() => expect(unCheckedView).toBeChecked()).toThrow();
  expect(() =>
    expect(partiallyCheckedView).not.toBePartiallyChecked()
  ).toThrow();
});

test('toBeCheck() with radio role', () => {
  render(<ViewWithRole role="radio" />);

  const checkedView = screen.getByTestId('radio-checked');
  const unCheckedView = screen.getByTestId('radio-unchecked');
  const partiallyCheckedView = screen.getByTestId('radio-mixChecked');
  expect(checkedView).toBeChecked();
  expect(unCheckedView).not.toBeChecked();
  expect(partiallyCheckedView).toBePartiallyChecked();

  expect(() => expect(checkedView).not.toBeChecked()).toThrow();
  expect(() => expect(unCheckedView).toBeChecked()).toThrow();
  expect(() =>
    expect(partiallyCheckedView).not.toBePartiallyChecked()
  ).toThrow();
});
