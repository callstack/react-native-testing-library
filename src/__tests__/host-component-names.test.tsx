import { View } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { configureInternal, getConfig } from '../config';
import { getHostComponentNames } from '../helpers/host-component-names';

const mockCreate = jest.spyOn(TestRenderer, 'create') as jest.Mock;

describe('getHostComponentNames', () => {
  test('updates internal config with host component names when they are not defined', () => {
    expect(getConfig().hostComponentNames).toBeUndefined();

    getHostComponentNames();

    expect(getConfig().hostComponentNames).toEqual({
      text: 'Text',
      textInput: 'TextInput',
    });
  });

  test('does not update internal config when host component names are already configured', () => {
    configureInternal({
      hostComponentNames: { text: 'banana', textInput: 'banana' },
    });

    getHostComponentNames();

    expect(getConfig().hostComponentNames).toEqual({
      text: 'banana',
      textInput: 'banana',
    });
  });

  test('throw an error when autodetection fails', () => {
    mockCreate.mockReturnValue({
      root: { type: View, children: [], props: {} },
    });

    expect(() => getHostComponentNames()).toThrowErrorMatchingInlineSnapshot(`
      "Trying to detect host component names triggered the following error:

      Unable to find an element with testID: text

      There seems to be an issue with your configuration that prevents React Native Testing Library from working correctly.
      Please check if you are using compatible versions of React Native and React Native Testing Library.
      "
    `);
  });
});
