// @flow

import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { create } from 'react-test-renderer';

describe('custom-matchers', () => {
  function render(node) {
    return create(node).getInstance();
  }
  describe('.toBeDisabled', () => {
    describe('Button', () => {
      it('returns true if Button is disabled explicitly', () => {
        const node = render(
          <Button disabled={true} title="Click Me" onPress={() => {}} />
        );
        expect(node).toBeDisabled();
      });
      it('returns true if Button is disabled implicitly', () => {
        const node = render(
          <Button disabled title="Click Me" onPress={() => {}} />
        );
        expect(node).toBeDisabled();
      });
      it("returns false for Button doesn't have disabled prop", () => {
        const node = render(<Button title="Click Me" onPress={() => {}} />);

        expect(node).not.toBeDisabled();
      });
      it('returns false if Button is disabled explicitly', () => {
        const node = render(
          <Button disabled={false} title="Click Me" onPress={() => {}} />
        );

        expect(node).not.toBeDisabled();
      });
    });
    describe('TextInput', () => {
      it('returns true if TextInput is disabled', () => {
        const node = render(<TextInput disabled />);
        expect(node).toBeDisabled();
      });
      it('returns false for un-disabled TextInput', () => {
        const node = render(<TextInput />);

        expect(node).not.toBeDisabled();
      });
    });
  });

  describe('.toBeEmpty', () => {
    it('returns true if node is empty', () => {
      const node = render(<View />);

      expect(node).toBeEmpty();
    });
    it('returns true if is non-empty node ', () => {
      const node = render(
        <View>
          <Text>d</Text>
        </View>
      );

      expect(node).not.toBeEmpty();
    });
  });
});
