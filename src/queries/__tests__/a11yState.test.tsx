import * as React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibilityState: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibilityState: ${value}`;
};

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
    getNoInstancesFoundMessage('{"disabled":true}')
  );
  expect(queryByA11yState({ disabled: true })).toEqual(null);

  expect(() => getByA11yState({ expanded: false })).toThrow(
    getMultipleInstancesFoundMessage('{"expanded":false}')
  );
  expect(() => queryByA11yState({ expanded: false })).toThrow(
    getMultipleInstancesFoundMessage('{"expanded":false}')
  );

  const asyncButton = await findByA11yState({ selected: true });
  expect(asyncButton.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  await expect(findByA11yState({ disabled: true })).rejects.toThrow(
    getNoInstancesFoundMessage('{"disabled":true}')
  );
  await expect(findByA11yState({ expanded: false })).rejects.toThrow(
    getMultipleInstancesFoundMessage('{"expanded":false}')
  );
});

test('getAllByA11yState, queryAllByA11yState, findAllByA11yState', async () => {
  const { getAllByA11yState, queryAllByA11yState, findAllByA11yState } = render(
    <Section />
  );

  expect(getAllByA11yState({ selected: true })).toHaveLength(1);
  expect(queryAllByA11yState({ selected: true })).toHaveLength(1);

  expect(() => getAllByA11yState({ disabled: true })).toThrow(
    getNoInstancesFoundMessage('{"disabled":true}')
  );
  expect(queryAllByA11yState({ disabled: true })).toEqual([]);

  expect(getAllByA11yState({ expanded: false })).toHaveLength(2);
  expect(queryAllByA11yState({ expanded: false })).toHaveLength(2);

  await expect(findAllByA11yState({ selected: true })).resolves.toHaveLength(1);
  await expect(findAllByA11yState({ disabled: true })).rejects.toThrow(
    getNoInstancesFoundMessage('{"disabled":true}')
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
