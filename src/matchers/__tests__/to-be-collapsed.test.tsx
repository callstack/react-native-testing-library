import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toBeCollapsed() basic case', () => {
  render(
    <>
      <View testID="expanded" accessibilityState={{ expanded: true }} />
      <View testID="expanded-aria" aria-expanded />
      <View testID="not-expanded" accessibilityState={{ expanded: false }} />
      <View testID="not-expanded-aria" aria-expanded={false} />
      <View testID="default" />
    </>,
  );

  expect(screen.getByTestId('expanded')).not.toBeCollapsed();
  expect(screen.getByTestId('expanded-aria')).not.toBeCollapsed();
  expect(screen.getByTestId('not-expanded')).toBeCollapsed();
  expect(screen.getByTestId('not-expanded-aria')).toBeCollapsed();
  expect(screen.getByTestId('default')).not.toBeCollapsed();
});

test('toBeCollapsed() error messages', () => {
  render(
    <>
      <View testID="expanded" accessibilityState={{ expanded: true }} />
      <View testID="expanded-aria" aria-expanded />
      <View testID="not-expanded" accessibilityState={{ expanded: false }} />
      <View testID="not-expanded-aria" aria-expanded={false} />
      <View testID="default" />
    </>,
  );

  expect(() => expect(screen.getByTestId('expanded')).toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeCollapsed()

    Received element is not collapsed:
      <View
        accessibilityState={
          {
            "expanded": true,
          }
        }
        testID="expanded"
      />"
  `);

  expect(() => expect(screen.getByTestId('expanded-aria')).toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeCollapsed()

    Received element is not collapsed:
      <View
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).not.toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeCollapsed()

    Received element is collapsed:
      <View
        accessibilityState={
          {
            "expanded": false,
          }
        }
        testID="not-expanded"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded-aria')).not.toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeCollapsed()

    Received element is collapsed:
      <View
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeCollapsed()

    Received element is not collapsed:
      <View
        testID="default"
      />"
  `);
});
