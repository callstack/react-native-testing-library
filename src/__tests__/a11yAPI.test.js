// @flow
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '..';

const BUTTON_LABEL = 'button-label';
const TEXT_LABEL = 'text-label';

class Button extends React.Component<*> {
  render() {
    return (
      <TouchableOpacity
        accessibilityLabel={BUTTON_LABEL}
        accessibilityStates={['disabled', 'selected']}
      >
        <Text accessibilityLabel={TEXT_LABEL}>Text 1</Text>
        <Text accessibilityLabel={TEXT_LABEL}>Text 2</Text>
      </TouchableOpacity>
    );
  }
}

test('getByA11yLabel, queryByA11yLabel', () => {
  const { getByA11yStates } = render(<Button />);

  console.log(getByA11yStates(['disabled', 'selected']));
});

test('getAllByA11yLabel, queryAllByA11yLabel', () => {});

test('getByA11yHint, queryByA11yHint', () => {});

test('getAllByA11yHint, queryAllByA11yHint', () => {});

test('getByA11yRole, queryByA11yRole', () => {});

test('getAllByA11yRole, queryAllByA11yRole', () => {});

test('getByA11yStates, queryByA11yStates', () => {});

test('getAllByA11yStates, queryAllByA11yStates', () => {});
