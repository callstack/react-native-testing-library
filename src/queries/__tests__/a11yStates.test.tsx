import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibilityStates: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibilityStates: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity
    // @ts-ignore - accessibilityStates removed in RN 0.62
    accessibilityStates={['selected']}
  >
    <Typography accessibilityStates={['selected']}>{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography
      // @ts-ignore - accessibilityStates removed in RN 0.62
      accessibilityStates={['selected', 'disabled']}
    >
      Title
    </Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

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

  expect(() => getByA11yStates('selected')).toThrow(
    getMultipleInstancesFoundMessage('["selected"]')
  );
  expect(() => queryByA11yStates('selected')).toThrow(
    getMultipleInstancesFoundMessage('["selected"]')
  );
});

// TODO: accessibilityStates was removed from RN 0.62
test.skip('getAllByA11yStates, queryAllByA11yStates', () => {
  const { getAllByA11yStates, queryAllByA11yStates } = render(<Section />);

  expect(getAllByA11yStates('selected')).toHaveLength(3);
  expect(queryAllByA11yStates(['selected'])).toHaveLength(3);

  expect(() => getAllByA11yStates([])).toThrow(
    getNoInstancesFoundMessage('[]')
  );
  expect(queryAllByA11yStates(NO_MATCHES_TEXT)).toEqual([]);
});
