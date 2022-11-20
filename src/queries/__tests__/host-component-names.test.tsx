import React from 'react';
import { Text, TextInput } from 'react-native';
import { render, screen, configure } from '../../pure';

describe('host component names', () => {
  test('byText queries should use text host name from config', () => {
    render(<Text>hello</Text>);

    expect(screen.getByText('hello')).toBeTruthy();

    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    expect(screen.queryByText('hello')).toBeFalsy();
  });

  test('byDisplayValue queries should use textInput host name from config', () => {
    render(<TextInput value="email" />);

    expect(screen.getByDisplayValue('email')).toBeTruthy();

    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    expect(screen.queryByDisplayValue('email')).toBeFalsy();
  });

  test('byPlaceholderText queries should use textInput host name from config', () => {
    render(<TextInput placeholder="email" />);

    expect(screen.getByPlaceholderText('email')).toBeTruthy();

    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    expect(screen.queryByPlaceholderText('email')).toBeFalsy();
  });

  it('should suggest appropriated config when a getByText query fails and wrong component names are used', () => {
    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    render(<Text>hello</Text>);

    expect(() => screen.getByText('hello')).toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with text: hello

      The wrong host component names are used. This can happen if you use a version of react native that is not compatible with your version of @testing-library/react-native

      To fix this, either upgrade to a version that supports your version of react native or add the following line in a setup file :

      configure({ hostComponentNames: { text: 'Text', textInput: 'TextInput' } });"
    `);
  });

  it('should suggest appropriated config when a getByDisplayValue query fails and wrong component names are used', () => {
    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    render(<TextInput value="value" />);

    expect(() => screen.getByDisplayValue('value'))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with displayValue: value

      The wrong host component names are used. This can happen if you use a version of react native that is not compatible with your version of @testing-library/react-native

      To fix this, either upgrade to a version that supports your version of react native or add the following line in a setup file :

      configure({ hostComponentNames: { text: 'Text', textInput: 'TextInput' } });"
    `);
  });

  it('should suggest appropriated config when a getByPlaceholderText query fails and wrong component names are used', () => {
    configure({
      hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
    });

    render(<TextInput placeholder="placeholder" />);

    expect(() => screen.getByPlaceholderText('placeholder'))
      .toThrowErrorMatchingInlineSnapshot(`
      "Unable to find an element with placeholder: placeholder

      The wrong host component names are used. This can happen if you use a version of react native that is not compatible with your version of @testing-library/react-native

      To fix this, either upgrade to a version that supports your version of react native or add the following line in a setup file :

      configure({ hostComponentNames: { text: 'Text', textInput: 'TextInput' } });"
    `);
  });

  it('should not suggest to change config when a query fails but the correct component names are used', () => {
    render(<Text>bonjour</Text>);

    expect(() => screen.getByText('hello')).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find an element with text: hello"`
    );
  });
});
