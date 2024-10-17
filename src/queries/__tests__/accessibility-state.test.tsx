/* eslint-disable no-console */
import * as React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { render, screen } from '../..';

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
    <Typography accessibilityState={{ expanded: false, selected: true }}>{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityState={{ expanded: false }}>Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByA11yState, queryByA11yState, findByA11yState', async () => {
  render(<Section />);

  expect(screen.getByA11yState({ selected: true }).props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  expect(screen.queryByA11yState({ selected: true })?.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });

  expect(() => screen.getByA11yState({ disabled: true })).toThrow(
    'Unable to find an element with disabled state: true',
  );
  expect(screen.queryByA11yState({ disabled: true })).toEqual(null);

  expect(() => screen.getByA11yState({ expanded: false })).toThrow(
    'Found multiple elements with expanded state: false',
  );
  expect(() => screen.queryByA11yState({ expanded: false })).toThrow(
    'Found multiple elements with expanded state: false',
  );

  const asyncButton = await screen.findByA11yState({ selected: true });
  expect(asyncButton.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  await expect(screen.findByA11yState({ disabled: true })).rejects.toThrow(
    'Unable to find an element with disabled state: true',
  );
  await expect(screen.findByA11yState({ expanded: false })).rejects.toThrow(
    'Found multiple elements with expanded state: false',
  );
});

test('getAllByA11yState, queryAllByA11yState, findAllByA11yState', async () => {
  render(<Section />);

  expect(screen.getAllByA11yState({ selected: true })).toHaveLength(1);
  expect(screen.queryAllByA11yState({ selected: true })).toHaveLength(1);

  expect(() => screen.getAllByA11yState({ disabled: true })).toThrow(
    'Unable to find an element with disabled state: true',
  );
  expect(screen.queryAllByA11yState({ disabled: true })).toEqual([]);

  expect(screen.getAllByA11yState({ expanded: false })).toHaveLength(2);
  expect(screen.queryAllByA11yState({ expanded: false })).toHaveLength(2);

  await expect(screen.findAllByA11yState({ selected: true })).resolves.toHaveLength(1);
  await expect(screen.findAllByA11yState({ disabled: true })).rejects.toThrow(
    'Unable to find an element with disabled state: true',
  );
  await expect(screen.findAllByA11yState({ expanded: false })).resolves.toHaveLength(2);
});

describe('checked state matching', () => {
  it('handles true', () => {
    render(<View role="checkbox" accessibilityState={{ checked: true }} />);

    expect(screen.getByA11yState({ checked: true })).toBeTruthy();
    expect(screen.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
    expect(screen.queryByA11yState({ checked: false })).toBeFalsy();
  });

  it('handles mixed', () => {
    render(<View role="checkbox" accessibilityState={{ checked: 'mixed' }} />);

    expect(screen.getByA11yState({ checked: 'mixed' })).toBeTruthy();
    expect(screen.queryByA11yState({ checked: true })).toBeFalsy();
    expect(screen.queryByA11yState({ checked: false })).toBeFalsy();
  });

  it('handles false', () => {
    render(<View role="checkbox" accessibilityState={{ checked: false }} />);

    expect(screen.getByA11yState({ checked: false })).toBeTruthy();
    expect(screen.queryByA11yState({ checked: true })).toBeFalsy();
    expect(screen.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
  });

  it('handles default', () => {
    render(<View role="checkbox" accessibilityState={{}} />);

    expect(screen.queryByA11yState({ checked: false })).toBeFalsy();
    expect(screen.queryByA11yState({ checked: true })).toBeFalsy();
    expect(screen.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
  });
});

describe('expanded state matching', () => {
  it('handles true', () => {
    render(<View accessibilityState={{ expanded: true }} />);

    expect(screen.getByA11yState({ expanded: true })).toBeTruthy();
    expect(screen.queryByA11yState({ expanded: false })).toBeFalsy();
  });

  it('handles false', () => {
    render(<View accessibilityState={{ expanded: false }} />);

    expect(screen.getByA11yState({ expanded: false })).toBeTruthy();
    expect(screen.queryByA11yState({ expanded: true })).toBeFalsy();
  });

  it('handles default', () => {
    render(<View accessibilityState={{}} />);

    expect(screen.queryByA11yState({ expanded: false })).toBeFalsy();
    expect(screen.queryByA11yState({ expanded: true })).toBeFalsy();
  });
});

describe('disabled state matching', () => {
  it('handles true', () => {
    render(<View accessibilityState={{ disabled: true }} />);

    expect(screen.getByA11yState({ disabled: true })).toBeTruthy();
    expect(screen.queryByA11yState({ disabled: true })).toBeTruthy();

    const x = screen.queryByA11yState({ disabled: false });
    expect(x).toMatchInlineSnapshot(`null`);
    expect(screen.queryByA11yState({ disabled: false })).toBeFalsy();
  });

  it('handles false', () => {
    render(<View accessibilityState={{ disabled: false }} />);

    expect(screen.getByA11yState({ disabled: false })).toBeTruthy();
    expect(screen.queryByA11yState({ disabled: true })).toBeFalsy();
  });

  it('handles default', () => {
    render(<View accessibilityState={{}} />);

    expect(screen.getByA11yState({ disabled: false })).toBeTruthy();
    expect(screen.queryByA11yState({ disabled: true })).toBeFalsy();
  });
});

describe('busy state matching', () => {
  it('handles true', () => {
    render(<View accessibilityState={{ busy: true }} />);

    expect(screen.getByA11yState({ busy: true })).toBeTruthy();
    expect(screen.queryByA11yState({ busy: false })).toBeFalsy();
  });

  it('handles false', () => {
    render(<View accessibilityState={{ busy: false }} />);

    expect(screen.getByA11yState({ busy: false })).toBeTruthy();
    expect(screen.queryByA11yState({ busy: true })).toBeFalsy();
  });

  it('handles default', () => {
    render(<View accessibilityState={{}} />);

    expect(screen.getByA11yState({ busy: false })).toBeTruthy();
    expect(screen.queryByA11yState({ busy: true })).toBeFalsy();
  });
});

describe('selected state matching', () => {
  it('handles true', () => {
    render(<View accessibilityState={{ selected: true }} />);

    expect(screen.getByA11yState({ selected: true })).toBeTruthy();
    expect(screen.queryByA11yState({ selected: false })).toBeFalsy();
  });

  it('handles false', () => {
    render(<View accessibilityState={{ selected: false }} />);

    expect(screen.getByA11yState({ selected: false })).toBeTruthy();
    expect(screen.queryByA11yState({ selected: true })).toBeFalsy();
  });

  it('handles default', () => {
    render(<View accessibilityState={{}} />);

    expect(screen.getByA11yState({ selected: false })).toBeTruthy();
    expect(screen.queryByA11yState({ selected: true })).toBeFalsy();
  });
});

test('*ByA11yState on Pressable with "disabled" prop', () => {
  render(<Pressable disabled />);
  expect(screen.getByA11yState({ disabled: true })).toBeTruthy();
  expect(screen.queryByA11yState({ disabled: false })).toBeFalsy();
});

test('*ByA11yState on TouchableOpacity with "disabled" prop', () => {
  render(<TouchableOpacity disabled />);
  expect(screen.getByA11yState({ disabled: true })).toBeTruthy();
  expect(screen.queryByA11yState({ disabled: false })).toBeFalsy();
});

test('byA11yState queries support hidden option', () => {
  render(
    <Pressable accessibilityState={{ expanded: false }} style={{ display: 'none' }}>
      <Text>Hidden from accessibility</Text>
    </Pressable>,
  );

  expect(screen.getByA11yState({ expanded: false }, { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByA11yState({ expanded: false })).toBeFalsy();
  expect(
    screen.queryByA11yState({ expanded: false }, { includeHiddenElements: false }),
  ).toBeFalsy();
  expect(() => screen.getByA11yState({ expanded: false }, { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with expanded state: false

    <View
      accessibilityState={
        {
          "expanded": false,
        }
      }
      accessible={true}
      style={
        {
          "display": "none",
        }
      }
    >
      <Text>
        Hidden from accessibility
      </Text>
    </View>"
  `);
});

test('*ByA11yState deprecation warnings', async () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  render(<View accessibilityState={{ disabled: true }} />);

  screen.getByA11yState({ disabled: true });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByA11yState(...) is deprecated and will be removed in the future.

    Use getByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.getAllByA11yState({ disabled: true });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByA11yState(...) is deprecated and will be removed in the future.

    Use getAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.queryByA11yState({ disabled: true });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByA11yState(...) is deprecated and will be removed in the future.

    Use queryByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.queryAllByA11yState({ disabled: true });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByA11yState(...) is deprecated and will be removed in the future.

    Use queryAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await screen.findByA11yState({ disabled: true });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByA11yState(...) is deprecated and will be removed in the future.

    Use findByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await screen.findAllByA11yState({ disabled: true });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByA11yState(...) is deprecated and will be removed in the future.

    Use findAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);
});

test('*ByAccessibilityState deprecation warnings', async () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  render(<View accessibilityState={{ disabled: true }} />);

  screen.getByAccessibilityState({ disabled: true });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByAccessibilityState(...) is deprecated and will be removed in the future.

    Use getByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.getAllByAccessibilityState({ disabled: true });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use getAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.queryByAccessibilityState({ disabled: true });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByAccessibilityState(...) is deprecated and will be removed in the future.

    Use queryByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  screen.queryAllByAccessibilityState({ disabled: true });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use queryAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await screen.findByAccessibilityState({ disabled: true });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByAccessibilityState(...) is deprecated and will be removed in the future.

    Use findByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await screen.findAllByAccessibilityState({ disabled: true });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use findAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(
    <Text accessibilityState={{ checked: false }} onPress={() => null}>
      Some text
    </Text>,
  );

  expect(() => screen.getByA11yState({ checked: true })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with checked state: true

    <Text
      accessibilityState={
        {
          "checked": false,
        }
      }
    >
      Some text
    </Text>"
  `);

  expect(() => screen.getAllByA11yState({ checked: true })).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with checked state: true

    <Text
      accessibilityState={
        {
          "checked": false,
        }
      }
    >
      Some text
    </Text>"
  `);

  await expect(screen.findByA11yState({ checked: true })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with checked state: true

    <Text
      accessibilityState={
        {
          "checked": false,
        }
      }
    >
      Some text
    </Text>"
  `);

  await expect(screen.findAllByA11yState({ checked: true })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with checked state: true

    <Text
      accessibilityState={
        {
          "checked": false,
        }
      }
    >
      Some text
    </Text>"
  `);
});

describe('aria-disabled prop', () => {
  test('supports aria-disabled={true} prop', () => {
    render(<View accessible aria-disabled={true} />);
    expect(screen.getByAccessibilityState({ disabled: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: false })).toBeNull();
  });

  test('supports aria-disabled={false} prop', () => {
    render(<View accessible aria-disabled={false} />);
    expect(screen.getByAccessibilityState({ disabled: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: true })).toBeNull();
  });

  test('supports default aria-disabled prop', () => {
    render(<View accessible />);
    expect(screen.getByAccessibilityState({ disabled: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: true })).toBeNull();
  });
});

describe('aria-selected prop', () => {
  test('supports aria-selected={true} prop', () => {
    render(<View accessible aria-selected={true} />);
    expect(screen.getByAccessibilityState({ selected: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: false })).toBeNull();
  });

  test('supports aria-selected={false} prop', () => {
    render(<View accessible aria-selected={false} />);
    expect(screen.getByAccessibilityState({ selected: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: true })).toBeNull();
  });

  test('supports default aria-selected prop', () => {
    render(<View accessible />);
    expect(screen.getByAccessibilityState({ selected: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: true })).toBeNull();
  });
});

describe('aria-checked prop', () => {
  test('supports aria-checked={true} prop', () => {
    render(<View accessible role="checkbox" aria-checked={true} />);
    expect(screen.getByAccessibilityState({ checked: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });

  test('supports aria-checked={false} prop', () => {
    render(<View accessible role="checkbox" aria-checked={false} />);
    expect(screen.getByAccessibilityState({ checked: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });

  test('supports aria-checked="mixed" prop', () => {
    render(<View accessible role="checkbox" aria-checked="mixed" />);
    expect(screen.getByAccessibilityState({ checked: 'mixed' })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
  });

  test('supports default aria-checked prop', () => {
    render(<View accessible role="checkbox" />);
    expect(screen.getByAccessibilityState({})).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });
});

describe('aria-busy prop', () => {
  test('supports aria-busy={true} prop', () => {
    render(<View accessible aria-busy={true} />);
    expect(screen.getByAccessibilityState({ busy: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: false })).toBeNull();
  });

  test('supports aria-busy={false} prop', () => {
    render(<View accessible aria-busy={false} />);
    expect(screen.getByAccessibilityState({ busy: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: true })).toBeNull();
  });

  test('supports default aria-busy prop', () => {
    render(<View accessible />);
    expect(screen.getByAccessibilityState({ busy: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: true })).toBeNull();
  });
});

describe('aria-expanded prop', () => {
  test('supports aria-expanded={true} prop', () => {
    render(<View accessible accessibilityRole="button" aria-expanded={true} />);
    expect(screen.getByAccessibilityState({ expanded: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: false })).toBeNull();
  });

  test('supports aria-expanded={false} prop', () => {
    render(<View accessible accessibilityRole="button" aria-expanded={false} />);
    expect(screen.getByAccessibilityState({ expanded: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: true })).toBeNull();
  });

  test('supports default aria-expanded prop', () => {
    render(<View accessible accessibilityRole="button" />);
    render(<View accessible accessibilityRole="button" />);
    expect(screen.getByAccessibilityState({})).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ expanded: false })).toBeNull();
  });
});
