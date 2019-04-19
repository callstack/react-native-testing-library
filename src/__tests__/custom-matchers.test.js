// @flow

import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { render } from '..';

describe('custom-matchers', () => {
  describe('.toBeDisabled', () => {
    describe('Button', () => {
      const BUTTON_IMPLICIT_DISABLED = 'button-implicit-disabled';
      const BUTTON_EXPLICIT_ENABLED = 'button-explicit-enabled';
      const BUTTON_IMPLICIT_ENABLED = 'button-implicit-enabled';
      const TestComponent = () => (
        <View>
          <Button
            testID={BUTTON_IMPLICIT_DISABLED}
            disabled
            title="Click Me"
            onPress={() => {}}
          />
          <Button
            testID={BUTTON_EXPLICIT_ENABLED}
            disabled={false}
            title="Click Me"
            onPress={() => {}}
          />
          <Button
            testID={BUTTON_IMPLICIT_ENABLED}
            title="Click Me"
            onPress={() => {}}
          />
        </View>
      );

      test.each([BUTTON_IMPLICIT_DISABLED])(
        'node with %s testID is disabled',
        (testID: string) => {
          const { getByTestId } = render(<TestComponent />);

          expect(getByTestId(testID)).toBeDisabled();
        }
      );

      test.each([BUTTON_EXPLICIT_ENABLED, BUTTON_IMPLICIT_ENABLED])(
        'node with %s testID is NOT disabled',
        (testID: string) => {
          const { getByTestId } = render(<TestComponent />);

          expect(getByTestId(testID)).not.toBeDisabled();
        }
      );
    });
    describe('TextInput', () => {
      it('returns true if TextInput is disabled', () => {
        const DISABLED_TEXTINPUT = 'disabled-textinput';
        const { getByTestId } = render(
          <TextInput testID={DISABLED_TEXTINPUT} disabled />
        );
        expect(getByTestId(DISABLED_TEXTINPUT)).toBeDisabled();
      });
      it('returns false if TextInput is NOT disabled', () => {
        const DISABLED_TEXTINPUT = 'disabled-textinput';
        const { getByTestId } = render(
          <TextInput testID={DISABLED_TEXTINPUT} />
        );
        expect(getByTestId(DISABLED_TEXTINPUT)).not.toBeDisabled();
      });
    });
  });

  describe('.toBeEmpty', () => {
    const NON_EMPTY_TEXT = 'non-empty-text';
    const EMPTY_TEXT = 'empty-text';
    const ONE_NON_EMPTY_CHILD = 'one-non-empty-child';
    const ONE_EMPTY_CHILD = 'one-empty-child';
    const MULTIPLE_EMPTY_CHILDREN = 'multiple-empty-children';
    const ONE_NON_EMPTY_CHILDREN = 'one-non-empty-children';

    const TestComponent = () => (
      <View>
        <Text testID={NON_EMPTY_TEXT}>Content</Text>
        <Text testID={EMPTY_TEXT} />
        <View>
          <Text testID={ONE_NON_EMPTY_CHILD}>Content</Text>
        </View>
        <View testID={ONE_EMPTY_CHILD}>
          <Text />
        </View>
        <View testID={MULTIPLE_EMPTY_CHILDREN}>
          <Text />
          <Text />
        </View>
        <View testID={ONE_NON_EMPTY_CHILDREN}>
          <Text />
          <Text>Content</Text>
        </View>
      </View>
    );

    test.each([NON_EMPTY_TEXT, ONE_NON_EMPTY_CHILDREN, ONE_NON_EMPTY_CHILD])(
      'element with %s testID should not be empty',
      (testID: string) => {
        const { getByTestId } = render(<TestComponent />);

        expect(getByTestId(testID)).not.toBeEmpty();
      }
    );

    test.each([EMPTY_TEXT, MULTIPLE_EMPTY_CHILDREN, ONE_EMPTY_CHILD])(
      'element with %s testID should be empty',
      (testID: string) => {
        const { getByTestId } = render(<TestComponent />);

        expect(getByTestId(testID)).toBeEmpty();
      }
    );
  });
});
