import * as React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';

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
      <View_withRef
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
      <View_withRef
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeExpanded()

    Received element is not expanded:
      <View_withRef
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
      <View_withRef
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeExpanded()

    Received element is not expanded:
      <View_withRef
        testID="default"
      />"
  `);
});

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
      <View_withRef
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
      <View_withRef
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).not.toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeCollapsed()

    Received element is collapsed:
      <View_withRef
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
      <View_withRef
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeCollapsed()

    Received element is not collapsed:
      <View_withRef
        testID="default"
      />"
  `);
});
