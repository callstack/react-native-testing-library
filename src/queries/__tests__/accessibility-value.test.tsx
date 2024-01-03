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
    <Typography accessibilityValue={{ min: 40, max: 60 }}>{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityValue={{ max: 60 }}>Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByA11yValue, queryByA11yValue, findByA11yValue', async () => {
  const { getByA11yValue, queryByA11yValue, findByA11yValue } = render(<Section />);

  expect(getByA11yValue({ min: 40 }).props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  expect(queryByA11yValue({ min: 40 })?.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });

  expect(() => getByA11yValue({ min: 50 })).toThrow('Unable to find an element with min value: 50');
  expect(queryByA11yValue({ min: 50 })).toEqual(null);

  expect(() => getByA11yValue({ max: 60 })).toThrow('Found multiple elements with max value: 60');
  expect(() => queryByA11yValue({ max: 60 })).toThrow('Found multiple elements with max value: 60');

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
  const { getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue } = render(<Section />);

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

  expect(getByA11yValue({ max: 10 }, { includeHiddenElements: true })).toBeTruthy();

  expect(queryByA11yValue({ max: 10 })).toBeFalsy();
  expect(queryByA11yValue({ max: 10 }, { includeHiddenElements: false })).toBeFalsy();
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
  expect(() => getByA11yValue({ min: 10, max: 10 })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 10, max value: 10

    <View />"
  `);
  expect(() => getByA11yValue({ max: 20, now: 5 })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with max value: 20, now value: 5

    <View />"
  `);
  expect(() => getByA11yValue({ min: 1, max: 2, now: 3 })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1, max value: 2, now value: 3

    <View />"
  `);
  expect(() => getByA11yValue({ min: 1, max: 2, now: 3, text: /foo/i }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1, max value: 2, now value: 3, text value: /foo/i

    <View />"
  `);
});

test('*ByA11yValue deprecation warnings', async () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  const view = render(<View accessibilityValue={{ min: 10 }} />);

  view.getByA11yValue({ min: 10 });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or getByRole(role, { value: ... }) query instead."
  `);

  view.getAllByA11yValue({ min: 10 });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or getAllByRole(role, { value: ... }) query instead."
  `);

  view.queryByA11yValue({ min: 10 });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or queryByRole(role, { value: ... }) query instead."
  `);

  view.queryAllByA11yValue({ min: 10 });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or queryAllByRole(role, { value: ... }) query instead."
  `);

  await view.findByA11yValue({ min: 10 });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or findByRole(role, { value: ... }) query instead."
  `);

  await view.findAllByA11yValue({ min: 10 });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByA11yValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or findAllByRole(role, { value: ... }) query instead."
  `);
});

test('*ByAccessibilityValue deprecation warnings', async () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  const view = render(<View accessibilityValue={{ min: 10 }} />);

  view.getByAccessibilityValue({ min: 10 });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or getByRole(role, { value: ... }) query instead."
  `);

  view.getAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or getAllByRole(role, { value: ... }) query instead."
  `);

  view.queryByAccessibilityValue({ min: 10 });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or queryByRole(role, { value: ... }) query instead."
  `);

  view.queryAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or queryAllByRole(role, { value: ... }) query instead."
  `);

  await view.findByAccessibilityValue({ min: 10 });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or findByRole(role, { value: ... }) query instead."
  `);

  await view.findAllByAccessibilityValue({ min: 10 });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByAccessibilityValue(...) is deprecated and will be removed in the future.

    Use toHaveAccessibilityValue(...) built-in Jest matcher or findAllByRole(role, { value: ... }) query instead."
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<View accessibilityValue={{ min: 2 }} key="NOT_RELEVANT" />);

  expect(() => view.getByA11yValue({ min: 1 })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  expect(() => view.getAllByA11yValue({ min: 1 })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  await expect(view.findByA11yValue({ min: 1 })).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with min value: 1

    <View
      accessibilityValue={
        {
          "min": 2,
        }
      }
    />"
  `);

  await expect(view.findAllByA11yValue({ min: 1 })).rejects.toThrowErrorMatchingInlineSnapshot(`
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

describe('getByAccessibilityValue supports "aria-*" props', () => {
  test('supports "aria-valuemax"', () => {
    const screen = render(<View aria-valuemax={10} />);
    expect(screen.getByAccessibilityValue({ max: 10 })).toBeTruthy();
  });

  test('supports "aria-valuemin"', () => {
    const screen = render(<View aria-valuemin={20} />);
    expect(screen.getByAccessibilityValue({ min: 20 })).toBeTruthy();
  });

  test('supports "aria-valuenow"', () => {
    const screen = render(<View aria-valuenow={30} />);
    expect(screen.getByAccessibilityValue({ now: 30 })).toBeTruthy();
  });

  test('supports "aria-valuetext"', () => {
    const screen = render(<View aria-valuetext="Hello World" />);
    expect(screen.getByAccessibilityValue({ text: 'Hello World' })).toBeTruthy();
    expect(screen.getByAccessibilityValue({ text: /hello/i })).toBeTruthy();
  });

  test('supports multiple "aria-value*" props', () => {
    const screen = render(<View aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />);
    expect(screen.getByAccessibilityValue({ now: 50, min: 0, max: 100 })).toBeTruthy();
  });
});
