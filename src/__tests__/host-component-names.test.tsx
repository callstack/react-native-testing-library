import React from 'react';
import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { configureInternal, getConfig } from '../config';
import {
  getHostComponentNames,
  configureHostComponentNamesIfNeeded,
} from '../helpers/host-component-names';
import * as within from '../within';
import { act, render } from '..';

const mockCreate = jest.spyOn(TestRenderer, 'create') as jest.Mock;
const mockGetQueriesForElements = jest.spyOn(
  within,
  'getQueriesForElement'
) as jest.Mock;

describe('getHostComponentNames', () => {
  test('returns host component names from internal config', () => {
    configureInternal({
      hostComponentNames: { text: 'banana', textInput: 'banana' },
    });

    expect(getHostComponentNames()).toEqual({
      text: 'banana',
      textInput: 'banana',
    });
  });

  test('throws when names are missing in the internal config', () => {
    expect(() => getHostComponentNames()).toThrowErrorMatchingInlineSnapshot(`
      "Missing host component names.

      There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
      Please check if you are using compatible versions of React Native and React Native Testing Library."
    `);
  });

  test('does not throw when wrapped in act after render has been called', () => {
    render(<View />);
    expect(() =>
      act(() => {
        getHostComponentNames();
      })
    ).not.toThrow();
  });
});

describe('configureHostComponentNamesIfNeeded', () => {
  test('updates internal config with host component names when they are not defined', () => {
    expect(getConfig().hostComponentNames).toBeUndefined();

    configureHostComponentNamesIfNeeded();

    expect(getConfig().hostComponentNames).toEqual({
      text: 'Text',
      textInput: 'TextInput',
    });
  });

  test('does not update internal config when host component names are already configured', () => {
    configureInternal({
      hostComponentNames: { text: 'banana', textInput: 'banana' },
    });

    configureHostComponentNamesIfNeeded();

    expect(getConfig().hostComponentNames).toEqual({
      text: 'banana',
      textInput: 'banana',
    });
  });

  test('throw an error when autodetection fails', () => {
    mockCreate.mockReturnValue({
      root: { type: View, children: [], props: {} },
    });

    expect(() => configureHostComponentNamesIfNeeded())
      .toThrowErrorMatchingInlineSnapshot(`
      "Trying to detect host component names triggered the following error:

      Unable to find an element with testID: text

      There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
      Please check if you are using compatible versions of React Native and React Native Testing Library."
    `);
  });

  test('throw an error when autodetection fails due to getByTestId returning non-host component', () => {
    mockGetQueriesForElements.mockReturnValue({
      getByTestId: () => {
        return { type: View };
      },
    });

    expect(() => configureHostComponentNamesIfNeeded())
      .toThrowErrorMatchingInlineSnapshot(`
      "Trying to detect host component names triggered the following error:

      getByTestId returned non-host component

      There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
      Please check if you are using compatible versions of React Native and React Native Testing Library."
    `);
  });
});
