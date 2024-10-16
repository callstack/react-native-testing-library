import * as React from 'react';
import { View } from 'react-native';
import { configureInternal, getConfig } from '../config';
import {
  getHostComponentNames,
  configureHostComponentNamesIfNeeded,
} from '../helpers/host-component-names';
import { act, render } from '..';
import * as internalRenderer from '../renderer/renderer';

describe('getHostComponentNames', () => {
  test('returns host component names from internal config', () => {
    configureInternal({
      hostComponentNames: {
        text: 'banana',
        textInput: 'banana',
        image: 'banana',
        switch: 'banana',
        scrollView: 'banana',
        modal: 'banana',
      },
    });

    expect(getHostComponentNames()).toEqual({
      text: 'banana',
      textInput: 'banana',
      image: 'banana',
      switch: 'banana',
      scrollView: 'banana',
      modal: 'banana',
    });
  });

  test('detects host component names if not present in internal config', () => {
    expect(getConfig().hostComponentNames).toBeUndefined();

    const hostComponentNames = getHostComponentNames();

    expect(hostComponentNames).toEqual({
      text: 'Text',
      textInput: 'TextInput',
      image: 'Image',
      switch: 'RCTSwitch',
      scrollView: 'RCTScrollView',
      modal: 'Modal',
    });
    expect(getConfig().hostComponentNames).toBe(hostComponentNames);
  });

  // Repro test for case when user indirectly triggers `getHostComponentNames` calls from
  // explicit `act` wrapper.
  // See: https://github.com/callstack/react-native-testing-library/issues/1302
  // and https://github.com/callstack/react-native-testing-library/issues/1305
  test('does not throw when wrapped in act after render has been called', () => {
    render(<View />);
    expect(() =>
      act(() => {
        getHostComponentNames();
      }),
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
      image: 'Image',
      switch: 'RCTSwitch',
      scrollView: 'RCTScrollView',
      modal: 'Modal',
    });
  });

  test('does not update internal config when host component names are already configured', () => {
    configureInternal({
      hostComponentNames: {
        text: 'banana',
        textInput: 'banana',
        image: 'banana',
        switch: 'banana',
        scrollView: 'banana',
        modal: 'banana',
      },
    });

    configureHostComponentNamesIfNeeded();

    expect(getConfig().hostComponentNames).toEqual({
      text: 'banana',
      textInput: 'banana',
      image: 'banana',
      switch: 'banana',
      scrollView: 'banana',
      modal: 'banana',
    });
  });

  test('throw an error when auto-detection fails', () => {
    let mockRender: jest.SpyInstance;
    const result = internalRenderer.render(<View />);

    mockRender = jest.spyOn(internalRenderer, 'render') as jest.Mock;
    mockRender.mockReturnValue({
      root: result.root,
    });

    expect(() => configureHostComponentNamesIfNeeded()).toThrowErrorMatchingInlineSnapshot(`
      "Trying to detect host component names triggered the following error:

      Unable to find an element with testID: text

      There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
      Please check if you are using compatible versions of React Native and React Native Testing Library."
    `);

    mockRender.mockReset();
  });
});
