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
