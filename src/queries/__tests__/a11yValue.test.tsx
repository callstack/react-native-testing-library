/* eslint-disable no-console */
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render } from '../..';

type ConsoleLogMock = jest.Mock<typeof console.log>;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

const TEXT_LABEL = 'cool text';

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity>
    <Typography accessibilityValue={{ min: 40, max: 60 }}>
      {children}
    </Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityValue={{ max: 60 }}>Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByA11yValue, queryByA11yValue, findByA11yValue', async () => {
  const { getByA11yValue, queryByA11yValue, findByA11yValue } = render(
    <Section />
  );

  expect(getByA11yValue({ min: 40 }).props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  expect(queryByA11yValue({ min: 40 })?.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });

  expect(() => getByA11yValue({ min: 50 })).toThrow(
    'Unable to find an element with min value: 50'
  );
  expect(queryByA11yValue({ min: 50 })).toEqual(null);

  expect(() => getByA11yValue({ max: 60 })).toThrow(
    'Found multiple elements with max value: 60'
  );
  expect(() => queryByA11yValue({ max: 60 })).toThrow(
    'Found multiple elements with max value: 60'
  );

  const asyncElement = await findByA11yValue({ min: 40 });
  expect(asyncElement.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  await expect(findByA11yValue({ min: 50 })).rejects.toThrow(
    'Unable to find an element with min value: 50'
  );
  await expect(findByA11yValue({ max: 60 })).rejects.toThrow(
    'Found multiple elements with max value: 60'
  );
});

test('getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue', async () => {
  const { getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue } = render(
    <Section />
  );

  expect(getAllByA11yValue({ min: 40 })).toHaveLength(1);
  expect(queryAllByA11yValue({ min: 40 })).toHaveLength(1);

  expect(() => getAllByA11yValue({ min: 50 })).toThrow(
    'Unable to find an element with min value: 50'
  );
  expect(queryAllByA11yValue({ min: 50 })).toEqual([]);

  expect(queryAllByA11yValue({ max: 60 })).toHaveLength(2);
  expect(getAllByA11yValue({ max: 60 })).toHaveLength(2);

  await expect(findAllByA11yValue({ min: 40 })).resolves.toHaveLength(1);
  await expect(findAllByA11yValue({ min: 50 })).rejects.toThrow(
    'Unable to find an element with min value: 50'
  );
  await expect(findAllByA11yValue({ max: 60 })).resolves.toHaveLength(2);
});

test('byA11yValue queries support hidden option', () => {
  const { getByA11yValue, queryByA11yValue } = render(
    <Text accessibilityValue={{ max: 10 }} style={{ display: 'none' }}>
      Hidden from accessibility
    </Text>
  );

  expect(
    getByA11yValue({ max: 10 }, { includeHiddenElements: true })
  ).toBeTruthy();

  expect(queryByA11yValue({ max: 10 })).toBeFalsy();
  expect(
    queryByA11yValue({ max: 10 }, { includeHiddenElements: false })
  ).toBeFalsy();
  expect(() => getByA11yValue({ max: 10 }, { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with max value: 10

    <Text
      accessibilityValue={
        {
          "max": 10,
        }
      }
      style={
        {
          "display": "none",
        }
      }
    >
      Hidden from accessibility
    </Text>"
  `);
});

test('byA11yValue error messages', () => {
  const { getByA11yValue } = render(<View />);
  expect(() => getByA11yValue({ min: 10, max: 10 }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 10, max value: 10

    <View />"
  `);
  expect(() => getByA11yValue({ max: 20, now: 5 }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with max value: 20, now value: 5

    <View />"
  `);
  expect(() => getByA11yValue({ min: 1, max: 2, now: 3 }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1, max value: 2, now value: 3

    <View />"
  `);
  expect(() => getByA11yValue({ min: 1, max: 2, now: 3, text: /foo/i }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1, max value: 2, now value: 3, text value: /foo/i

    <View />"
  `);
});

test('*ByA11yValue deprecation warnings', () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  const view = render(<View accessibilityValue={{ min: 10 }} />);

  view.getByA11yValue({ min: 10 });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or getByRole(role, { value: ... }) query instead."
  `);

  view.getAllByA11yValue({ min: 10 });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or getAllByRole(role, { value: ... }) query instead."
  `);

  view.queryByA11yValue({ min: 10 });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or queryByRole(role, { value: ... }) query instead."
  `);

  view.queryAllByA11yValue({ min: 10 });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or queryAllByRole(role, { value: ... }) query instead."
  `);

  view.findByA11yValue({ min: 10 });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or findByRole(role, { value: ... }) query instead."
  `);

  view.findAllByA11yValue({ min: 10 });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByA11yValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or findAllByRole(role, { value: ... }) query instead."
  `);
});

test('*ByAccessibilityValue deprecation warnings', () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  const view = render(<View accessibilityValue={{ min: 10 }} />);

  view.getByAccessibilityValue({ min: 10 });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or getByRole(role, { value: ... }) query instead."
  `);

  view.getAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or getAllByRole(role, { value: ... }) query instead."
  `);

  view.queryByAccessibilityValue({ min: 10 });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or queryByRole(role, { value: ... }) query instead."
  `);

  view.queryAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or queryAllByRole(role, { value: ... }) query instead."
  `);

  view.findByAccessibilityValue({ min: 10 });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or findByRole(role, { value: ... }) query instead."
  `);

  view.findAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use expect(...).toHaveAccessibilityValue(...) matcher from "@testing-library/jest-native" package or findAllByRole(role, { value: ... }) query instead."
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(
    <View accessibilityValue={{ min: 2 }} key="NOT_RELEVANT" />
  );

  expect(() => view.getByA11yValue({ min: 1 }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  expect(() => view.getAllByA11yValue({ min: 1 }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  await expect(view.findByA11yValue({ min: 1 })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  await expect(view.findAllByA11yValue({ min: 1 })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);
});
