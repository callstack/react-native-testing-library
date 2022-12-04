import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { configureInternal } from '../../config';
import { render, screen, configure } from '../../pure';

beforeEach(() => configureInternal({ useBreakingChanges: true }));

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

test('suggests appropriate config when a getByText query fails and wrong component names are used', () => {
  configure({
    hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
  });

  render(<Text>hello</Text>);

  expect(() => screen.getByText('hello')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with text: hello

    Your configuration contains invalid host component names. This can happen if you use a version of React Native that is not compatible with your version of @testing-library/react-native

    To fix this add following line in a Jest setup file :

    configure({ 
      hostComponentNames: { 
        text: 'Text',
        textInput: 'TextInput',
      }
    });"
  `);
});

test('suggests appropriate config when a getByDisplayValue query fails and wrong component names are used', () => {
  configure({
    hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
  });

  render(<TextInput value="value" />);

  expect(() => screen.getByDisplayValue('value'))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: value

    Your configuration contains invalid host component names. This can happen if you use a version of React Native that is not compatible with your version of @testing-library/react-native

    To fix this add following line in a Jest setup file :

    configure({ 
      hostComponentNames: { 
        text: 'Text',
        textInput: 'TextInput',
      }
    });"
  `);
});

test('suggests appropriate config when a getByPlaceholderText query fails and wrong component names are used', () => {
  configure({
    hostComponentNames: { text: 'wrongName', textInput: 'wrongName' },
  });

  render(<TextInput placeholder="placeholder" />);

  expect(() => screen.getByPlaceholderText('placeholder'))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: placeholder

    Your configuration contains invalid host component names. This can happen if you use a version of React Native that is not compatible with your version of @testing-library/react-native

    To fix this add following line in a Jest setup file :

    configure({ 
      hostComponentNames: { 
        text: 'Text',
        textInput: 'TextInput',
      }
    });"
  `);
});

test('does not suggest to change config when a query fails but the correct component names are used', () => {
  render(<Text>bonjour</Text>);

  expect(() => screen.getByText('hello')).toThrowErrorMatchingInlineSnapshot(
    `"Unable to find an element with text: hello"`
  );
});

test('does not update screen object when running detection', async () => {
  jest.useFakeTimers();

  const TestComponent = () => {
    const [shouldDisplayHello, setShouldDisplayHello] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setShouldDisplayHello(true);
      }, 500);
    }, []);

    if (shouldDisplayHello) {
      return <Text>hello</Text>;
    }

    return null;
  };

  render(<TestComponent />);

  expect(await screen.findByText('hello')).toBeTruthy();
  expect(screen.getByText('hello')).toBeTruthy();

  jest.useRealTimers();
});
