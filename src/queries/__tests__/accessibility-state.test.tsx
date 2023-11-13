/* eslint-disable no-console */
import * as React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
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
    <Typography accessibilityState={{ expanded: false, selected: true }}>
      {children}
    </Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityState={{ expanded: false }}>Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByA11yState, queryByA11yState, findByA11yState', async () => {
  const { getByA11yState, queryByA11yState, findByA11yState } = render(
    <Section />
  );

  expect(getByA11yState({ selected: true }).props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  expect(
    queryByA11yState({ selected: true })?.props.accessibilityState
  ).toEqual({
    selected: true,
    expanded: false,
  });

  expect(() => getByA11yState({ disabled: true })).toThrow(
    'Unable to find an element with disabled state: true'
  );
  expect(queryByA11yState({ disabled: true })).toEqual(null);

  expect(() => getByA11yState({ expanded: false })).toThrow(
    'Found multiple elements with expanded state: false'
  );
  expect(() => queryByA11yState({ expanded: false })).toThrow(
    'Found multiple elements with expanded state: false'
  );

  const asyncButton = await findByA11yState({ selected: true });
  expect(asyncButton.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  await expect(findByA11yState({ disabled: true })).rejects.toThrow(
    'Unable to find an element with disabled state: true'
  );
  await expect(findByA11yState({ expanded: false })).rejects.toThrow(
    'Found multiple elements with expanded state: false'
  );
});

test('getAllByA11yState, queryAllByA11yState, findAllByA11yState', async () => {
  const { getAllByA11yState, queryAllByA11yState, findAllByA11yState } = render(
    <Section />
  );

  expect(getAllByA11yState({ selected: true })).toHaveLength(1);
  expect(queryAllByA11yState({ selected: true })).toHaveLength(1);

  expect(() => getAllByA11yState({ disabled: true })).toThrow(
    'Unable to find an element with disabled state: true'
  );
  expect(queryAllByA11yState({ disabled: true })).toEqual([]);

  expect(getAllByA11yState({ expanded: false })).toHaveLength(2);
  expect(queryAllByA11yState({ expanded: false })).toHaveLength(2);

  await expect(findAllByA11yState({ selected: true })).resolves.toHaveLength(1);
  await expect(findAllByA11yState({ disabled: true })).rejects.toThrow(
    'Unable to find an element with disabled state: true'
  );
  await expect(findAllByA11yState({ expanded: false })).resolves.toHaveLength(
    2
  );
});

describe('checked state matching', () => {
  it('handles true', () => {
    const view = render(<View accessibilityState={{ checked: true }} />);

    expect(view.getByA11yState({ checked: true })).toBeTruthy();
    expect(view.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
    expect(view.queryByA11yState({ checked: false })).toBeFalsy();
  });

  it('handles mixed', () => {
    const view = render(<View accessibilityState={{ checked: 'mixed' }} />);

    expect(view.getByA11yState({ checked: 'mixed' })).toBeTruthy();
    expect(view.queryByA11yState({ checked: true })).toBeFalsy();
    expect(view.queryByA11yState({ checked: false })).toBeFalsy();
  });

  it('handles false', () => {
    const view = render(<View accessibilityState={{ checked: false }} />);

    expect(view.getByA11yState({ checked: false })).toBeTruthy();
    expect(view.queryByA11yState({ checked: true })).toBeFalsy();
    expect(view.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
  });

  it('handles  default', () => {
    const view = render(<View accessibilityState={{}} />);

    expect(view.queryByA11yState({ checked: false })).toBeFalsy();
    expect(view.queryByA11yState({ checked: true })).toBeFalsy();
    expect(view.queryByA11yState({ checked: 'mixed' })).toBeFalsy();
  });
});

describe('expanded state matching', () => {
  it('handles true', () => {
    const view = render(<View accessibilityState={{ expanded: true }} />);

    expect(view.getByA11yState({ expanded: true })).toBeTruthy();
    expect(view.queryByA11yState({ expanded: false })).toBeFalsy();
  });

  it('handles false', () => {
    const view = render(<View accessibilityState={{ expanded: false }} />);

    expect(view.getByA11yState({ expanded: false })).toBeTruthy();
    expect(view.queryByA11yState({ expanded: true })).toBeFalsy();
  });

  it('handles  default', () => {
    const view = render(<View accessibilityState={{}} />);

    expect(view.queryByA11yState({ expanded: false })).toBeFalsy();
    expect(view.queryByA11yState({ expanded: true })).toBeFalsy();
  });
});

describe('disabled state matching', () => {
  it('handles true', () => {
    const view = render(<View accessibilityState={{ disabled: true }} />);

    expect(view.getByA11yState({ disabled: true })).toBeTruthy();
    expect(view.queryByA11yState({ disabled: false })).toBeFalsy();
  });

  it('handles false', () => {
    const view = render(<View accessibilityState={{ disabled: false }} />);

    expect(view.getByA11yState({ disabled: false })).toBeTruthy();
    expect(view.queryByA11yState({ disabled: true })).toBeFalsy();
  });

  it('handles  default', () => {
    const view = render(<View accessibilityState={{}} />);

    expect(view.getByA11yState({ disabled: false })).toBeTruthy();
    expect(view.queryByA11yState({ disabled: true })).toBeFalsy();
  });
});

describe('busy state matching', () => {
  it('handles true', () => {
    const view = render(<View accessibilityState={{ busy: true }} />);

    expect(view.getByA11yState({ busy: true })).toBeTruthy();
    expect(view.queryByA11yState({ busy: false })).toBeFalsy();
  });

  it('handles false', () => {
    const view = render(<View accessibilityState={{ busy: false }} />);

    expect(view.getByA11yState({ busy: false })).toBeTruthy();
    expect(view.queryByA11yState({ busy: true })).toBeFalsy();
  });

  it('handles  default', () => {
    const view = render(<View accessibilityState={{}} />);

    expect(view.getByA11yState({ busy: false })).toBeTruthy();
    expect(view.queryByA11yState({ busy: true })).toBeFalsy();
  });
});

describe('selected state matching', () => {
  it('handles true', () => {
    const view = render(<View accessibilityState={{ selected: true }} />);

    expect(view.getByA11yState({ selected: true })).toBeTruthy();
    expect(view.queryByA11yState({ selected: false })).toBeFalsy();
  });

  it('handles false', () => {
    const view = render(<View accessibilityState={{ selected: false }} />);

    expect(view.getByA11yState({ selected: false })).toBeTruthy();
    expect(view.queryByA11yState({ selected: true })).toBeFalsy();
  });

  it('handles  default', () => {
    const view = render(<View accessibilityState={{}} />);

    expect(view.getByA11yState({ selected: false })).toBeTruthy();
    expect(view.queryByA11yState({ selected: true })).toBeFalsy();
  });
});

test('*ByA11yState on Pressable with "disabled" prop', () => {
  const view = render(<Pressable disabled />);
  expect(view.getByA11yState({ disabled: true })).toBeTruthy();
  expect(view.queryByA11yState({ disabled: false })).toBeFalsy();
});

test('*ByA11yState on TouchableOpacity with "disabled" prop', () => {
  const view = render(<TouchableOpacity disabled />);
  expect(view.getByA11yState({ disabled: true })).toBeTruthy();
  expect(view.queryByA11yState({ disabled: false })).toBeFalsy();
});

test('byA11yState queries support hidden option', () => {
  const { getByA11yState, queryByA11yState } = render(
    <Pressable
      accessibilityState={{ expanded: false }}
      style={{ display: 'none' }}
    >
      <Text>Hidden from accessibility</Text>
    </Pressable>
  );

  expect(
    getByA11yState({ expanded: false }, { includeHiddenElements: true })
  ).toBeTruthy();

  expect(queryByA11yState({ expanded: false })).toBeFalsy();
  expect(
    queryByA11yState({ expanded: false }, { includeHiddenElements: false })
  ).toBeFalsy();
  expect(() =>
    getByA11yState({ expanded: false }, { includeHiddenElements: false })
  ).toThrowErrorMatchingInlineSnapshot(`
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
  const view = render(<View accessibilityState={{ disabled: true }} />);

  view.getByA11yState({ disabled: true });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByA11yState(...) is deprecated and will be removed in the future.

    Use getByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.getAllByA11yState({ disabled: true });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByA11yState(...) is deprecated and will be removed in the future.

    Use getAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.queryByA11yState({ disabled: true });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByA11yState(...) is deprecated and will be removed in the future.

    Use queryByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.queryAllByA11yState({ disabled: true });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByA11yState(...) is deprecated and will be removed in the future.

    Use queryAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await view.findByA11yState({ disabled: true });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByA11yState(...) is deprecated and will be removed in the future.

    Use findByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await view.findAllByA11yState({ disabled: true });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByA11yState(...) is deprecated and will be removed in the future.

    Use findAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);
});

test('*ByAccessibilityState deprecation warnings', async () => {
  const mockCalls = (console.warn as ConsoleLogMock).mock.calls;
  const view = render(<View accessibilityState={{ disabled: true }} />);

  view.getByAccessibilityState({ disabled: true });
  expect(mockCalls[0][0]).toMatchInlineSnapshot(`
    "getByAccessibilityState(...) is deprecated and will be removed in the future.

    Use getByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.getAllByAccessibilityState({ disabled: true });
  expect(mockCalls[1][0]).toMatchInlineSnapshot(`
    "getAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use getAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.queryByAccessibilityState({ disabled: true });
  expect(mockCalls[2][0]).toMatchInlineSnapshot(`
    "queryByAccessibilityState(...) is deprecated and will be removed in the future.

    Use queryByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  view.queryAllByAccessibilityState({ disabled: true });
  expect(mockCalls[3][0]).toMatchInlineSnapshot(`
    "queryAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use queryAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await view.findByAccessibilityState({ disabled: true });
  expect(mockCalls[4][0]).toMatchInlineSnapshot(`
    "findByAccessibilityState(...) is deprecated and will be removed in the future.

    Use findByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);

  await view.findAllByAccessibilityState({ disabled: true });
  expect(mockCalls[5][0]).toMatchInlineSnapshot(`
    "findAllByAccessibilityState(...) is deprecated and will be removed in the future.

    Use findAllByRole(role, { disabled, selected, checked, busy, expanded }) query or built-in Jest matchers: toBeDisabled(), toBeSelected(), toBeChecked(), toBeBusy(), and toBeExpanded() instead."
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(
    <Text accessibilityState={{ checked: false }} onPress={() => null}>
      Some text
    </Text>
  );

  expect(() => view.getByA11yState({ checked: true }))
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

  expect(() => view.getAllByA11yState({ checked: true }))
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

  await expect(view.findByA11yState({ checked: true })).rejects
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

  await expect(view.findAllByA11yState({ checked: true })).rejects
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
    const screen = render(<View accessible aria-disabled={true} />);
    expect(screen.getByAccessibilityState({ disabled: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: false })).toBeNull();
  });

  test('supports aria-disabled={false} prop', () => {
    const screen = render(<View accessible aria-disabled={false} />);
    expect(screen.getByAccessibilityState({ disabled: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: true })).toBeNull();
  });

  test('supports default aria-disabled prop', () => {
    const screen = render(<View accessible />);
    expect(screen.getByAccessibilityState({ disabled: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ disabled: true })).toBeNull();
  });
});

describe('aria-selected prop', () => {
  test('supports aria-selected={true} prop', () => {
    const screen = render(<View accessible aria-selected={true} />);
    expect(screen.getByAccessibilityState({ selected: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: false })).toBeNull();
  });

  test('supports aria-selected={false} prop', () => {
    const screen = render(<View accessible aria-selected={false} />);
    expect(screen.getByAccessibilityState({ selected: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: true })).toBeNull();
  });

  test('supports default aria-selected prop', () => {
    const screen = render(<View accessible />);
    expect(screen.getByAccessibilityState({ selected: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ selected: true })).toBeNull();
  });
});

describe('aria-checked prop', () => {
  test('supports aria-checked={true} prop', () => {
    const screen = render(
      <View accessible accessibilityRole="button" aria-checked={true} />
    );
    expect(screen.getByAccessibilityState({ checked: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });

  test('supports aria-checked={false} prop', () => {
    const screen = render(
      <View accessible accessibilityRole="button" aria-checked={false} />
    );
    expect(screen.getByAccessibilityState({ checked: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });

  test('supports aria-checked="mixed prop', () => {
    const screen = render(
      <View accessible accessibilityRole="button" aria-checked="mixed" />
    );
    expect(screen.getByAccessibilityState({ checked: 'mixed' })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
  });

  test('supports default aria-selected prop', () => {
    const screen = render(<View accessible accessibilityRole="button" />);
    expect(screen.getByAccessibilityState({})).toBeTruthy();
    expect(screen.queryByAccessibilityState({ checked: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: false })).toBeNull();
    expect(screen.queryByAccessibilityState({ checked: 'mixed' })).toBeNull();
  });
});

describe('aria-busy prop', () => {
  test('supports aria-busy={true} prop', () => {
    const screen = render(<View accessible aria-busy={true} />);
    expect(screen.getByAccessibilityState({ busy: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: false })).toBeNull();
  });

  test('supports aria-busy={false} prop', () => {
    const screen = render(<View accessible aria-busy={false} />);
    expect(screen.getByAccessibilityState({ busy: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: true })).toBeNull();
  });

  test('supports default aria-busy prop', () => {
    const screen = render(<View accessible />);
    expect(screen.getByAccessibilityState({ busy: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ busy: true })).toBeNull();
  });
});

describe('aria-expanded prop', () => {
  test('supports aria-expanded={true} prop', () => {
    const screen = render(
      <View accessible accessibilityRole="button" aria-expanded={true} />
    );
    expect(screen.getByAccessibilityState({ expanded: true })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: false })).toBeNull();
  });

  test('supports aria-expanded={false} prop', () => {
    const screen = render(
      <View accessible accessibilityRole="button" aria-expanded={false} />
    );
    expect(screen.getByAccessibilityState({ expanded: false })).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: true })).toBeNull();
  });

  test('supports default aria-expanded prop', () => {
    const screen = render(<View accessible accessibilityRole="button" />);
    expect(screen.getByAccessibilityState({})).toBeTruthy();
    expect(screen.queryByAccessibilityState({ expanded: true })).toBeNull();
    expect(screen.queryByAccessibilityState({ expanded: false })).toBeNull();
  });
});
