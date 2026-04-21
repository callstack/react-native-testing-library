import * as React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';

test('toBeExpanded() basic case', async () => {
  await render(
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

test('toBeExpanded() error messages', async () => {
  await render(
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
    "expect(instance).not.toBeExpanded()

    Received instance is expanded:
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
    "expect(instance).not.toBeExpanded()

    Received instance is expanded:
      <View
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).toBeExpanded()

    Received instance is not expanded:
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
    "expect(instance).toBeExpanded()

    Received instance is not expanded:
      <View
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeExpanded())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).toBeExpanded()

    Received instance is not expanded:
      <View
        testID="default"
      />"
  `);
});

test('toBeCollapsed() basic case', async () => {
  await render(
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

test('toBeCollapsed() error messages', async () => {
  await render(
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
    "expect(instance).toBeCollapsed()

    Received instance is not collapsed:
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
    "expect(instance).toBeCollapsed()

    Received instance is not collapsed:
      <View
        aria-expanded={true}
        testID="expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('not-expanded')).not.toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).not.toBeCollapsed()

    Received instance is collapsed:
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
    "expect(instance).not.toBeCollapsed()

    Received instance is collapsed:
      <View
        aria-expanded={false}
        testID="not-expanded-aria"
      />"
  `);

  expect(() => expect(screen.getByTestId('default')).toBeCollapsed())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(instance).toBeCollapsed()

    Received instance is not collapsed:
      <View
        testID="default"
      />"
  `);
});
