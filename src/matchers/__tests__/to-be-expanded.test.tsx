import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toBeExpanded() basic case', () => {
  render(
    <>
      <View testID="expanded" accessibilityState={{ expanded: true }} />
      <View testID="expanded-aria" aria-expanded />
      <View testID="not-expanded" accessibilityState={{ expanded: false }} />
      <View testID="not-expanded-aria" aria-expanded={false} />
      <View testID="default" />
    </>,
  );

  expect(screen.getByTestId('expanded')).toBeExpanded();
  expect(screen.getByTestId('expanded-aria')).toBeExpanded();
  expect(screen.getByTestId('not-expanded')).not.toBeExpanded();
  expect(screen.getByTestId('not-expanded-aria')).not.toBeExpanded();
  expect(screen.getByTestId('default')).not.toBeExpanded();
});

test('toBeExpanded() error messages', () => {
  render(
    <>
      <View testID="expanded" accessibilityState={{ expanded: true }} />
      <View testID="expanded-aria" aria-expanded />
      <View testID="not-expanded" accessibilityState={{ expanded: false }} />
      <View testID="not-expanded-aria" aria-expanded={false} />
      <View testID="default" />
    </>,
  );

  expect(() => expect(screen.getByTestId('expanded')).not.toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeExpanded()

    Received element is expanded:
      <View
        accessibilityState={
          {
            "expanded": true,
          }
        }
        testID="expanded"
      />"
  `);

  expect(() => expect(screen.getByTestId('expanded-aria')).not.toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeExpanded()

    Received element is expanded:
      <View
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeExpanded()

    Received element is not expanded:
      <View
        accessibilityState={
          {
            "expanded": false,
          }
        }
        testID="not-expanded"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded-aria')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeExpanded()

    Received element is not expanded:
      <View
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeExpanded()

    Received element is not expanded:
      <View
        testID="default"
      />"
  `);
});
