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
        onPress={this.props.onPress}
      >
        <Text accessibilityLabel={TEXT_LABEL}>Text 1</Text>
        <Text accessibilityLabel={TEXT_LABEL}>Text 2</Text>
      </TouchableOpacity>
    );
  }
}

test('should find button by a11y label', () => {
  const { getByAccessibilityLabel } = render(<Button />);
  const results = getByAccessibilityLabel(BUTTON_LABEL);

  expect(getByAccessibilityLabel(BUTTON_LABEL).props.children).toHaveLength(2);
});

test('should find button by a11y label using regex', () => {
  const { getByAccessibilityLabel } = render(<Button />);

  expect(getByAccessibilityLabel(/button/g).props.children).toHaveLength(2);
});

test('should find all by a11y label', () => {
  const { getByAccessibilityLabel } = render(<Button />);

  expect(getByAccessibilityLabel(TEXT_LABEL)).toHaveLength(2);
});
