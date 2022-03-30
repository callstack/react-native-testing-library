import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { render } from '../index';

const BUTTON_LABEL = 'cool button';
const BUTTON_HINT = 'click this button';
const TEXT_LABEL = 'cool text';
const TEXT_HINT = 'static text';
const ONE_OCCURANCE = 'more words';
const TWO_OCCURANCE = 'cooler text';
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
      <TouchableOpacity
        accessibilityHint={BUTTON_HINT}
        accessibilityLabel={BUTTON_LABEL}
        accessibilityRole="button"
        // @ts-ignore - accessibilityStates removed in RN 0.62
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
        // @ts-ignore - accessibilityStates removed in RN 0.62
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

function ButtonsWithText() {
  return (
    <>
      <TouchableOpacity accessibilityRole="button">
        <Text>{TWO_OCCURANCE}</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button">
        <Text>{TWO_OCCURANCE}</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button">
        <Text>{ONE_OCCURANCE}</Text>
      </TouchableOpacity>
    </>
  );
}

test('getByLabelText, queryByLabelText, findByLabelText', async () => {
  const { getByLabelText, queryByLabelText, findByLabelText } = render(
    <Section />
  );

  expect(getByLabelText(BUTTON_LABEL).props.accessibilityLabel).toEqual(
    BUTTON_LABEL
  );
  const button = queryByLabelText(/button/g);
  expect(button?.props.accessibilityLabel).toEqual(BUTTON_LABEL);

  expect(() => getByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityLabel')
  );
  expect(queryByLabelText(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByLabelText(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByLabelText(TEXT_LABEL)).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByLabelText(BUTTON_LABEL);
  expect(asyncButton.props.accessibilityLabel).toEqual(BUTTON_LABEL);
  await expect(
    findByLabelText(NO_MATCHES_TEXT, {}, waitForOptions)
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityLabel'));

  await expect(findByLabelText(TEXT_LABEL, {}, waitForOptions)).rejects.toThrow(
    FOUND_TWO_INSTANCES
  );
});

test('getAllByLabelText, queryAllByLabelText, findAllByLabelText', async () => {
  const { getAllByLabelText, queryAllByLabelText, findAllByLabelText } = render(
    <Section />
  );

  expect(getAllByLabelText(TEXT_LABEL)).toHaveLength(2);
  expect(queryAllByLabelText(/cool/g)).toHaveLength(3);

  expect(() => getAllByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityLabel')
  );
  expect(queryAllByLabelText(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByLabelText(TEXT_LABEL)).resolves.toHaveLength(2);
  await expect(findAllByLabelText(NO_MATCHES_TEXT)).rejects.toThrow(
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
  expect(button?.props.accessibilityHint).toEqual(BUTTON_HINT);

  expect(() => getByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityHint')
  );
  expect(queryByA11yHint(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByA11yHint(TEXT_HINT)).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByA11yHint(BUTTON_HINT);
  expect(asyncButton.props.accessibilityHint).toEqual(BUTTON_HINT);
  await expect(
    findByA11yHint(NO_MATCHES_TEXT, {}, waitForOptions)
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityHint'));
  await expect(findByA11yHint(TEXT_HINT, {}, waitForOptions)).rejects.toThrow(
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

test('getByRole, queryByRole, findByRole', async () => {
  const { getByRole, queryByRole, findByRole } = render(<Section />);

  expect(getByRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByRole(/button/g);
  expect(button?.props.accessibilityRole).toEqual('button');

  expect(() => getByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryByRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByRole('link')).toThrow(FOUND_TWO_INSTANCES);
  expect(() => queryByRole('link')).toThrow(FOUND_TWO_INSTANCES);

  const asyncButton = await findByRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(findByRole(NO_MATCHES_TEXT, {}, waitForOptions)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  await expect(findByRole('link')).rejects.toThrow(FOUND_TWO_INSTANCES);
});

test('getAllByRole, queryAllByRole, findAllByRole', async () => {
  const { getAllByRole, queryAllByRole, findAllByRole } = render(<Section />);

  expect(getAllByRole('link')).toHaveLength(2);
  expect(queryAllByRole(/ink/g)).toHaveLength(2);

  expect(() => getAllByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryAllByRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByRole('link')).resolves.toHaveLength(2);
  await expect(
    findAllByRole(NO_MATCHES_TEXT, {}, waitForOptions)
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityRole'));
});

describe('findBy options deprecations', () => {
  let warnSpy;
  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('findByText queries warn on deprecated use of WaitForOptions', async () => {
    const options = { timeout: 10 };
    // mock implementation to avoid warning in the test suite
    const { rerender, findByText } = render(<View />);
    await expect(findByText('Some Text', options)).rejects.toBeTruthy();

    setTimeout(
      () =>
        rerender(
          <View>
            <Text>Some Text</Text>
          </View>
        ),
      20
    );

    await expect(findByText('Some Text')).resolves.toBeTruthy();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Use of option "timeout"')
    );
  }, 20000);
});

test('getAllByRole, queryAllByRole, findAllByRole with name', async () => {
  const { getAllByRole, queryAllByRole, findAllByRole } = render(
    <ButtonsWithText />
  );

  expect(getAllByRole('button', { name: TWO_OCCURANCE })).toHaveLength(2);
  expect(getAllByRole('button', { name: ONE_OCCURANCE })).toHaveLength(1);
  expect(queryAllByRole('button', { name: TWO_OCCURANCE })).toHaveLength(2);

  expect(() => getAllByRole('button', { name: NO_MATCHES_TEXT })).toThrow(
    getNoInstancesFoundMessage('accessibilityRole', 'button')
  );
  expect(queryAllByRole('button', { name: NO_MATCHES_TEXT })).toEqual([]);

  await expect(
    findAllByRole('button', { name: TWO_OCCURANCE })
  ).resolves.toHaveLength(2);
  await expect(
    findAllByRole('button', { name: NO_MATCHES_TEXT })
  ).rejects.toThrow(getNoInstancesFoundMessage('accessibilityRole', 'button'));
});

// TODO: accessibilityStates was removed from RN 0.62
test.skip('getByA11yStates, queryByA11yStates', () => {
  const { getByA11yStates, queryByA11yStates } = render(<Section />);

  expect(getByA11yStates('disabled').props.accessibilityStates).toEqual([
    'selected',
    'disabled',
  ]);
  const disabled = queryByA11yStates(['disabled']);
  expect(disabled?.props.accessibilityStates).toMatchObject([
    'selected',
    'disabled',
  ]);
  const disabledSelected = queryByA11yStates(['selected', 'disabled']);
  expect(disabledSelected?.props.accessibilityStates).toEqual([
    'selected',
    'disabled',
  ]);

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
    findByA11yState({ disabled: true }, {}, waitForOptions)
  ).rejects.toThrow(
    getNoInstancesFoundMessage(
      'accessibilityState',
      '{"disabled": true}',
      false
    )
  );
  await expect(
    findByA11yState({ expanded: false }, {}, waitForOptions)
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
    findAllByA11yState({ disabled: true }, {}, waitForOptions)
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
  await expect(
    findByA11yValue({ min: 50 }, {}, waitForOptions)
  ).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  await expect(
    findByA11yValue({ max: 60 }, {}, waitForOptions)
  ).rejects.toThrow(FOUND_TWO_INSTANCES);
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
  await expect(
    findAllByA11yValue({ min: 50 }, {}, waitForOptions)
  ).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityValue', '{"min": 50}', false)
  );
  await expect(findAllByA11yValue({ max: 60 })).resolves.toHaveLength(2);
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
