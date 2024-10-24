import React from 'react';
import { type AccessibilityRole, View } from 'react-native';
import render from '../../render';
import { screen } from '../../screen';

function renderViewsWithRole(role: AccessibilityRole) {
  return render(
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
        testID={`${role}-mixed`}
        accessible
        accessibilityRole={role}
        accessibilityState={{ checked: 'mixed' }}
      />
      <View testID={`${role}-default`} accessible accessibilityRole={role} />
    </>,
  );
}

test('toBePartiallyCheck() with checkbox role', () => {
  renderViewsWithRole('checkbox');

  const checked = screen.getByTestId('checkbox-checked');
  const unchecked = screen.getByTestId('checkbox-unchecked');
  const mixed = screen.getByTestId('checkbox-mixed');
  const defaultView = screen.getByTestId('checkbox-default');

  expect(mixed).toBePartiallyChecked();

  expect(checked).not.toBePartiallyChecked();
  expect(unchecked).not.toBePartiallyChecked();
  expect(defaultView).not.toBePartiallyChecked();

  expect(() => expect(mixed).not.toBePartiallyChecked()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBePartiallyChecked()

    Received element is partially checked:
      <View
        accessibilityRole="checkbox"
        accessibilityState={
          {
            "checked": "mixed",
          }
        }
        accessible={true}
        testID="checkbox-mixed"
      />"
  `);

  expect(() => expect(checked).toBePartiallyChecked()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBePartiallyChecked()

    Received element is not partially checked:
      <View
        accessibilityRole="checkbox"
        accessibilityState={
          {
            "checked": true,
          }
        }
        accessible={true}
        testID="checkbox-checked"
      />"
  `);
  expect(() => expect(defaultView).toBePartiallyChecked()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBePartiallyChecked()

    Received element is not partially checked:
      <View
        accessibilityRole="checkbox"
        accessible={true}
        testID="checkbox-default"
      />"
  `);
});

test('toBeCheck() with radio role', () => {
  renderViewsWithRole('radio');

  const checked = screen.getByTestId('radio-checked');
  const mixed = screen.getByTestId('radio-mixed');

  expect(() => expect(checked).toBePartiallyChecked()).toThrowErrorMatchingInlineSnapshot(
    `"toBePartiallyChecked() works only on accessibility elements with "checkbox" role."`,
  );
  expect(() => expect(mixed).toBePartiallyChecked()).toThrowErrorMatchingInlineSnapshot(
    `"toBePartiallyChecked() works only on accessibility elements with "checkbox" role."`,
  );
});
