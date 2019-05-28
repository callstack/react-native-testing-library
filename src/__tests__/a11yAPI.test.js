// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '..';

const BUTTON_LABEL = 'cool button';
const BUTTON_HINT = 'click this button';
const BUTTON_ROLE = 'button';
const TEXT_LABEL = 'cool text';
const TEXT_HINT = 'static text';
const TEXT_ROLE = 'link';
const NO_MATCHES_TEXT = 'not-existent-element';

const NO_INSTANCES_FOUND = 'No instances found';
const FOUND_TWO_INSTANCES = 'Expected 1 but found 2 instances';

const Typography = ({ children, ...rest }) => {
  return <Text {...rest}>{children}</Text>;
};

class Button extends React.Component<*> {
  render() {
    return (
      <TouchableOpacity
        accessibilityHint={BUTTON_HINT}
        accessibilityLabel={BUTTON_LABEL}
        accessibilityRole={BUTTON_ROLE}
        accessibilityStates={['selected']}
      >
        <Typography
          accessibilityHint={TEXT_HINT}
          accessibilityLabel={TEXT_LABEL}
          accessibilityRole={TEXT_ROLE}
          accessibilityStates={['selected']}
        >
          {this.props.children}
        </Typography>
      </TouchableOpacity>
    );
  }
}

function Section() {
  return (
    <>
      <Typography
        accessibilityHint={TEXT_HINT}
        accessibilityLabel={TEXT_LABEL}
        accessibilityRole={TEXT_ROLE}
        accessibilityStates={['selected', 'disabled']}
      >
        Title
      </Typography>
      <Button>{TEXT_LABEL}</Button>
    </>
  );
}

test('getByA11yLabel, queryByA11yLabel', () => {
  const { getByA11yLabel, queryByA11yLabel } = render(<Section />);

  expect(getByA11yLabel(BUTTON_LABEL).props.accessibilityLabel).toEqual(
    BUTTON_LABEL
  );
  const button = queryByA11yLabel(/button/g);
  expect(button && button.props.accessibilityLabel).toEqual(BUTTON_LABEL);
  expect(() => getByA11yLabel(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryByA11yLabel(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yLabel(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yLabel(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yLabel, queryAllByA11yLabel', () => {
  const { getAllByA11yLabel, queryAllByA11yLabel } = render(<Section />);

  expect(getAllByA11yLabel(TEXT_LABEL)).toHaveLength(2);
  expect(queryAllByA11yLabel(/cool/g)).toHaveLength(3);
  expect(() => getAllByA11yLabel(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryAllByA11yLabel(NO_MATCHES_TEXT)).toEqual([]);
});

test('getByA11yHint, queryByA11yHint', () => {
  const { getByA11yHint, queryByA11yHint } = render(<Section />);

  expect(getByA11yHint(BUTTON_HINT).props.accessibilityHint).toEqual(
    BUTTON_HINT
  );
  const button = queryByA11yHint(/button/g);
  expect(button && button.props.accessibilityHint).toEqual(BUTTON_HINT);
  expect(() => getByA11yHint(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryByA11yHint(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yHint, queryAllByA11yHint', () => {
  const { getAllByA11yHint, queryAllByA11yHint } = render(<Section />);

  expect(getAllByA11yHint(TEXT_HINT)).toHaveLength(2);
  expect(queryAllByA11yHint(/static/g)).toHaveLength(2);
  expect(() => getAllByA11yHint(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryAllByA11yHint(NO_MATCHES_TEXT)).toEqual([]);
});

test('getByA11yRole, queryByA11yRole', () => {
  const { getByA11yRole, queryByA11yRole } = render(<Section />);

  expect(getByA11yRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByA11yRole(/button/g);
  expect(button && button.props.accessibilityRole).toEqual('button');
  expect(() => getByA11yRole(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryByA11yRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yRole('link')).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yRole('link')).toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yRole, queryAllByA11yRole', () => {
  const { getAllByA11yRole, queryAllByA11yRole } = render(<Section />);

  expect(getAllByA11yRole('link')).toHaveLength(2);
  expect(queryAllByA11yRole(/ink/g)).toHaveLength(2);
  expect(() => getAllByA11yRole(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryAllByA11yRole(NO_MATCHES_TEXT)).toEqual([]);
});

test('getByA11yStates, queryByA11yStates', () => {
  const { getByA11yStates, queryByA11yStates } = render(<Section />);

  expect(getByA11yStates('disabled').props.accessibilityStates).toEqual([
    'selected',
    'disabled',
  ]);
  const disabled = queryByA11yStates(['disabled']);
  expect(disabled && disabled.props.accessibilityStates).toMatchObject([
    'selected',
    'disabled',
  ]);
  const disabledSelected = queryByA11yStates(['selected', 'disabled']);
  expect(
    disabledSelected && disabledSelected.props.accessibilityStates
  ).toEqual(['selected', 'disabled']);

  expect(() => getByA11yStates(NO_MATCHES_TEXT)).toThrow(NO_INSTANCES_FOUND);
  expect(queryByA11yStates(NO_MATCHES_TEXT)).toBeNull();
  expect(queryByA11yStates([])).toBeNull();

  expect(() => getByA11yStates('selected')).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yStates('selected')).toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yStates, queryAllByA11yStates', () => {
  const { getAllByA11yStates, queryAllByA11yStates } = render(<Section />);

  expect(getAllByA11yStates('selected')).toHaveLength(3);
  expect(queryAllByA11yStates(['selected'])).toHaveLength(3);

  expect(() => getAllByA11yStates([])).toThrow(NO_INSTANCES_FOUND);
  expect(queryAllByA11yStates(NO_MATCHES_TEXT)).toEqual([]);
});
