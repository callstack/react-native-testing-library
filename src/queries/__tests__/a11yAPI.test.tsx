import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

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
