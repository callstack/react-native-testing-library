// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '..';

const BUTTON_LABEL = 'cool button';
const BUTTON_HINT = 'click this button';
const TEXT_LABEL = 'cool text';
const TEXT_HINT = 'static text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';
const FOUND_TWO_INSTANCES = 'Expected 1 but found 2 instances';

const getNoInstancesFoundMessage = (
  name: string,
  value: string = NO_MATCHES_TEXT,
  includeQuotes: boolean = true
) => {
  const quote = includeQuotes ? '"' : '';
  return `No instances found with ${name} ${quote}${value}${quote}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const waitForOptions = { timeout: 10 };

class Button extends React.Component<any> {
  render() {
    return (
      // $FlowFixMe - accessibilityStates removed in RN 0.62
      <TouchableOpacity
        accessibilityHint={BUTTON_HINT}
        accessibilityLabel={BUTTON_LABEL}
        accessibilityRole="button"
        accessibilityStates={['selected']}
      >
        <Typography
          accessibilityHint={TEXT_HINT}
          accessibilityLabel={TEXT_LABEL}
          accessibilityRole="link"
          accessibilityStates={['selected']}
          accessibilityState={{ expanded: false, selected: true }}
          accessibilityValue={{ min: 40, max: 60 }}
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
        accessibilityRole="link"
        // $FlowFixMe - removed in RN 0.62
        accessibilityStates={['selected', 'disabled']}
        accessibilityState={{ expanded: false }}
        accessibilityValue={{ max: 60 }}
      >
        Title
      </Typography>
      <Button>{TEXT_LABEL}</Button>
    </>
  );
}

test('getByA11yLabel, queryByA11yLabel, findByA11yLabel', async () => {
  const { getByA11yLabel, queryByA11yLabel, findByA11yLabel } = render(
    <Section />
  );

  expect(getByA11yLabel(BUTTON_LABEL).props.accessibilityLabel).toEqual(
    BUTTON_LABEL
  );
  const button = queryByA11yLabel(/button/g);
  expect(button && button.props.accessibilityLabel).toEqual(BUTTON_LABEL);

  expect(() => getByA11yLabel(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityLabel')
  );
  expect(queryByA11yLabel(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yLabel(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yLabel(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByA11yLabel(BUTTON_LABEL);
  expect(asyncButton.props.accessibilityLabel).toEqual(BUTTON_LABEL);
  await expect(
    findByA11yLabel(NO_MATCHES_TEXT, waitForOptions)
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityLabel'));

  await expect(findByA11yLabel(TEXT_LABEL, waitForOptions)).rejects.toThrow(
    FOUND_TWO_INSTANCES
  );
});

test('getAllByA11yLabel, queryAllByA11yLabel, findAllByA11yLabel', async () => {
  const { getAllByA11yLabel, queryAllByA11yLabel, findAllByA11yLabel } = render(
    <Section />
  );

  expect(getAllByA11yLabel(TEXT_LABEL)).toHaveLength(2);
  expect(queryAllByA11yLabel(/cool/g)).toHaveLength(3);

  expect(() => getAllByA11yLabel(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityLabel')
  );
  expect(queryAllByA11yLabel(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByA11yLabel(TEXT_LABEL)).resolves.toHaveLength(2);
  await expect(findAllByA11yLabel(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityLabel')
  );
});

test('getByA11yHint, queryByA11yHint, findByA11yHint', async () => {
  const { getByA11yHint, queryByA11yHint, findByA11yHint } = render(
    <Section />
  );

  expect(getByA11yHint(BUTTON_HINT).props.accessibilityHint).toEqual(
    BUTTON_HINT
  );
  const button = queryByA11yHint(/button/g);
  expect(button && button.props.accessibilityHint).toEqual(BUTTON_HINT);

  expect(() => getByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityHint')
  );
  expect(queryByA11yHint(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByA11yHint(BUTTON_HINT);
  expect(asyncButton.props.accessibilityHint).toEqual(BUTTON_HINT);
  await expect(findByA11yHint(NO_MATCHES_TEXT, waitForOptions)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityHint')
  );
  await expect(findByA11yHint(TEXT_HINT, waitForOptions)).rejects.toThrow(
    FOUND_TWO_INSTANCES
  );
});

test('getAllByA11yHint, queryAllByA11yHint, findAllByA11yHint', async () => {
  const { getAllByA11yHint, queryAllByA11yHint, findAllByA11yHint } = render(
    <Section />
  );

  expect(getAllByA11yHint(TEXT_HINT)).toHaveLength(2);
  expect(queryAllByA11yHint(/static/g)).toHaveLength(2);

  expect(() => getAllByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityHint')
  );
  expect(queryAllByA11yHint(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByA11yHint(TEXT_HINT)).resolves.toHaveLength(2);
  await expect(findAllByA11yHint(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityHint')
  );
});

test('getByA11yRole, queryByA11yRole, findByA11yRole', async () => {
  const { getByA11yRole, queryByA11yRole, findByA11yRole } = render(
    <Section />
  );

  expect(getByA11yRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByA11yRole(/button/g);
  expect(button && button.props.accessibilityRole).toEqual('button');

  expect(() => getByA11yRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryByA11yRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yRole('link')).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yRole('link')).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByA11yRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(findByA11yRole(NO_MATCHES_TEXT, waitForOptions)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  await expect(findByA11yRole('link')).rejects.toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yRole, queryAllByA11yRole, findAllByA11yRole', async () => {
  const { getAllByA11yRole, queryAllByA11yRole, findAllByA11yRole } = render(
    <Section />
  );

  expect(getAllByA11yRole('link')).toHaveLength(2);
  expect(queryAllByA11yRole(/ink/g)).toHaveLength(2);

  expect(() => getAllByA11yRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryAllByA11yRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByA11yRole('link')).resolves.toHaveLength(2);
  await expect(
    findAllByA11yRole(NO_MATCHES_TEXT, waitForOptions)
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityRole'));
});

// TODO: accessibilityStates was removed from RN 0.62
test.skip('getByA11yStates, queryByA11yStates', () => {
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

  expect(() => getByA11yStates(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityStates')
  );
  expect(queryByA11yStates(NO_MATCHES_TEXT)).toBeNull();
  expect(queryByA11yStates([])).toBeNull();

  expect(() => getByA11yStates('selected')).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yStates('selected')).toThrow(FOUND_TWO_INSTANCES);
});

// TODO: accessibilityStates was removed from RN 0.62
test.skip('getAllByA11yStates, queryAllByA11yStates', () => {
  const { getAllByA11yStates, queryAllByA11yStates } = render(<Section />);

  expect(getAllByA11yStates('selected')).toHaveLength(3);
  expect(queryAllByA11yStates(['selected'])).toHaveLength(3);

  expect(() => getAllByA11yStates([])).toThrow(
    getNoInstancesFoundMessage('accessibilityStates')
  );
  expect(queryAllByA11yStates(NO_MATCHES_TEXT)).toEqual([]);
});

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
    getNoInstancesFoundMessage(
      'accessibilityState',
      '{"disabled": true}',
      false
    )
  );
  expect(queryByA11yState({ disabled: true })).toEqual(null);

  expect(() => getByA11yState({ expanded: false })).toThrow(
    FOUND_TWO_INSTANCES
  );
  expect(() => queryByA11yState({ expanded: false })).toThrow(
    FOUND_TWO_INSTANCES
  );

  const asyncButton = await findByA11yState({ selected: true });
  expect(asyncButton.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  await expect(
    findByA11yState({ disabled: true }, waitForOptions)
  ).rejects.toThrow(
    getNoInstancesFoundMessage(
      'accessibilityState',
      '{"disabled": true}',
      false
    )
  );
  await expect(
    findByA11yState({ expanded: false }, waitForOptions)
  ).rejects.toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByA11yState, queryAllByA11yState, findAllByA11yState', async () => {
  const { getAllByA11yState, queryAllByA11yState, findAllByA11yState } = render(
    <Section />
  );

  expect(getAllByA11yState({ selected: true })).toHaveLength(1);
  expect(queryAllByA11yState({ selected: true })).toHaveLength(1);

  expect(() => getAllByA11yState({ disabled: true })).toThrow(
    getNoInstancesFoundMessage(
      'accessibilityState',
      '{"disabled": true}',
      false
    )
  );
  expect(queryAllByA11yState({ disabled: true })).toEqual([]);

  expect(getAllByA11yState({ expanded: false })).toHaveLength(2);
  expect(queryAllByA11yState({ expanded: false })).toHaveLength(2);

  await expect(findAllByA11yState({ selected: true })).resolves.toHaveLength(1);
  await expect(
    findAllByA11yState({ disabled: true }, waitForOptions)
  ).rejects.toThrow(
    getNoInstancesFoundMessage(
      'accessibilityState',
      '{"disabled": true}',
      false
    )
  );
  await expect(findAllByA11yState({ expanded: false })).resolves.toHaveLength(
    2
  );
});

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
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  expect(queryByA11yValue({ min: 50 })).toEqual(null);

  expect(() => getByA11yValue({ max: 60 })).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yValue({ max: 60 })).toThrow(FOUND_TWO_INSTANCES);

  const asyncElement = await findByA11yValue({ min: 40 });
  expect(asyncElement.props.accessibilityValue).toEqual({
    min: 40,
    max: 60,
  });
  await expect(findByA11yValue({ min: 50 }, waitForOptions)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  await expect(findByA11yValue({ max: 60 }, waitForOptions)).rejects.toThrow(
    FOUND_TWO_INSTANCES
  );
});

test('getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue', async () => {
  const { getAllByA11yValue, queryAllByA11yValue, findAllByA11yValue } = render(
    <Section />
  );

  expect(getAllByA11yValue({ min: 40 })).toHaveLength(1);
  expect(queryAllByA11yValue({ min: 40 })).toHaveLength(1);

  expect(() => getAllByA11yValue({ min: 50 })).toThrow(
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  expect(queryAllByA11yValue({ min: 50 })).toEqual([]);

  expect(queryAllByA11yValue({ max: 60 })).toHaveLength(2);
  expect(getAllByA11yValue({ max: 60 })).toHaveLength(2);

  await expect(findAllByA11yValue({ min: 40 })).resolves.toHaveLength(1);
  await expect(findAllByA11yValue({ min: 50 }, waitForOptions)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  await expect(findAllByA11yValue({ max: 60 })).resolves.toHaveLength(2);
});

test('a11y label queries have aliases', () => {
  const {
    getByA11yLabel,
    getByLabelText,
    queryByA11yLabel,
    queryByLabelText,
    findByA11yLabel,
    findByLabelText,
    getAllByA11yLabel,
    getAllByLabelText,
    queryAllByA11yLabel,
    queryAllByLabelText,
    findAllByA11yLabel,
    findAllByLabelText,
  } = render(<Section />);

  // Assert that query aliases are referencing the same function
  expect(getByA11yLabel).toBe(getByLabelText);
  expect(queryByA11yLabel).toBe(queryByLabelText);
  expect(findByA11yLabel).toBe(findByLabelText);
  expect(getAllByA11yLabel).toBe(getAllByLabelText);
  expect(queryAllByA11yLabel).toBe(queryAllByLabelText);
  expect(findAllByA11yLabel).toBe(findAllByLabelText);
});

test('a11y hint queries have aliases', () => {
  const {
    getByA11yHint,
    getByHintText,
    queryByA11yHint,
    queryByHintText,
    findByA11yHint,
    findByHintText,
    getAllByA11yHint,
    getAllByHintText,
    queryAllByA11yHint,
    queryAllByHintText,
    findAllByA11yHint,
    findAllByHintText,
  } = render(<Section />);

  // Assert that query aliases are referencing the same function
  expect(getByA11yHint).toBe(getByHintText);
  expect(queryByA11yHint).toBe(queryByHintText);
  expect(findByA11yHint).toBe(findByHintText);
  expect(getAllByA11yHint).toBe(getAllByHintText);
  expect(queryAllByA11yHint).toBe(queryAllByHintText);
  expect(findAllByA11yHint).toBe(findAllByHintText);
});

test('a11y role queries have aliases', () => {
  const {
    getByA11yRole,
    getByRole,
    queryByA11yRole,
    queryByRole,
    findByA11yRole,
    findByRole,
    getAllByA11yRole,
    getAllByRole,
    queryAllByA11yRole,
    queryAllByRole,
    findAllByA11yRole,
    findAllByRole,
  } = render(<Section />);

  // Assert that query aliases are referencing the same function
  expect(getByA11yRole).toBe(getByRole);
  expect(queryByA11yRole).toBe(queryByRole);
  expect(findByA11yRole).toBe(findByRole);
  expect(getAllByA11yRole).toBe(getAllByRole);
  expect(queryAllByA11yRole).toBe(queryAllByRole);
  expect(findAllByA11yRole).toBe(findAllByRole);
});
