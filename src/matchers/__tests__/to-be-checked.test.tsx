import { type AccessibilityRole, View } from 'react-native';
import render from '../../render';
import { screen } from '../../screen';
import '../extend-expect';

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
    </>
  );
}

test('toBeCheck() with checkbox role', () => {
  renderViewsWithRole('checkbox');

  const checked = screen.getByTestId('checkbox-checked');
  const unchecked = screen.getByTestId('checkbox-unchecked');
  const mixed = screen.getByTestId('checkbox-mixed');
  const defaultView = screen.getByTestId('checkbox-default');

  expect(checked).toBeChecked();
  expect(unchecked).not.toBeChecked();
  expect(mixed).not.toBeChecked();
  expect(defaultView).not.toBeChecked();

  expect(() => expect(checked).not.toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeChecked()

    Received element is checked:
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
  expect(() => expect(unchecked).toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeChecked()

    Received element is not checked:
      <View
        accessibilityRole="checkbox"
        accessibilityState={
          {
            "checked": false,
          }
        }
        accessible={true}
        testID="checkbox-unchecked"
      />"
  `);
  expect(() => expect(mixed).toBeChecked()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeChecked()

    Received element is not checked:
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
  expect(() => expect(defaultView).toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeChecked()

    Received element is not checked:
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
  const unchecked = screen.getByTestId('radio-unchecked');
  const defaultView = screen.getByTestId('radio-default');

  expect(checked).toBeChecked();
  expect(unchecked).not.toBeChecked();
  expect(defaultView).not.toBeChecked();

  expect(() => expect(checked).not.toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeChecked()

    Received element is checked:
      <View
        accessibilityRole="radio"
        accessibilityState={
          {
            "checked": true,
          }
        }
        accessible={true}
        testID="radio-checked"
      />"
  `);
  expect(() => expect(unchecked).toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeChecked()

    Received element is not checked:
      <View
        accessibilityRole="radio"
        accessibilityState={
          {
            "checked": false,
          }
        }
        accessible={true}
        testID="radio-unchecked"
      />"
  `);
  expect(() => expect(defaultView).toBeChecked())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeChecked()

    Received element is not checked:
      <View
        accessibilityRole="radio"
        accessible={true}
        testID="radio-default"
      />"
  `);
});

test('throws error for invalid role', () => {
  renderViewsWithRole('adjustable');

  const checked = screen.getByTestId('adjustable-checked');
  const unchecked = screen.getByTestId('adjustable-unchecked');

  expect(() =>
    expect(checked).toBeChecked()
  ).toThrowErrorMatchingInlineSnapshot(
    `"toBeChecked() works only on accessibility elements with "checkbox" or "radio" role."`
  );
  expect(() =>
    expect(unchecked).not.toBeChecked()
  ).toThrowErrorMatchingInlineSnapshot(
    `"toBeChecked() works only on accessibility elements with "checkbox" or "radio" role."`
  );
});

test('throws error for non-accessibility element', () => {
  render(<View testID="test" />);

  const view = screen.getByTestId('test');
  expect(() => expect(view).toBeChecked()).toThrowErrorMatchingInlineSnapshot(
    `"toBeChecked() works only on accessibility elements with "checkbox" or "radio" role."`
  );
});
