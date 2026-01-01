import * as React from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { render, screen } from '../..';
import { logger } from '../../helpers/logger';

const BUTTON_LABEL = 'cool button';
const BUTTON_HINT = 'click this button';
const TEXT_LABEL = 'cool text';
const TEXT_HINT = 'static text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibility label: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibility label: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <Pressable accessibilityHint={BUTTON_HINT} accessibilityLabel={BUTTON_LABEL}>
    <Typography accessibilityHint={TEXT_HINT} accessibilityLabel={TEXT_LABEL}>
      {children}
    </Typography>
  </Pressable>
);

const Section = () => (
  <>
    <Typography accessibilityHint={TEXT_HINT} accessibilityLabel={TEXT_LABEL}>
      Title
    </Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByLabelText, queryByLabelText, findByLabelText', async () => {
  render(<Section />);

  expect(screen.getByLabelText(BUTTON_LABEL).props.accessibilityLabel).toEqual(BUTTON_LABEL);
  const button = screen.queryByLabelText(/button/);
  expect(button?.props.accessibilityLabel).toEqual(BUTTON_LABEL);

  expect(() => screen.getByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryByLabelText(NO_MATCHES_TEXT)).toBeNull();

  expect(() => screen.getByLabelText(TEXT_LABEL)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL),
  );
  expect(() => screen.queryByLabelText(TEXT_LABEL)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL),
  );

  const asyncButton = await screen.findByLabelText(BUTTON_LABEL);
  expect(asyncButton.props.accessibilityLabel).toEqual(BUTTON_LABEL);
  await expect(screen.findByLabelText(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );

  await expect(screen.findByLabelText(TEXT_LABEL)).rejects.toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL),
  );
});

test('getAllByLabelText, queryAllByLabelText, findAllByLabelText', async () => {
  render(<Section />);

  expect(screen.getAllByLabelText(TEXT_LABEL)).toHaveLength(2);
  expect(screen.queryAllByLabelText(/cool/)).toHaveLength(3);

  expect(() => screen.getAllByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryAllByLabelText(NO_MATCHES_TEXT)).toEqual([]);

  await expect(screen.findAllByLabelText(TEXT_LABEL)).resolves.toHaveLength(2);
  await expect(screen.findAllByLabelText(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
});

test('getAllByLabelText, queryAllByLabelText, findAllByLabelText with exact as false', async () => {
  render(<Section />);

  expect(screen.getAllByLabelText(TEXT_LABEL, { exact: false })).toHaveLength(2);
  expect(screen.queryAllByLabelText(/cool/, { exact: false })).toHaveLength(3);

  expect(() => screen.getAllByLabelText(NO_MATCHES_TEXT, { exact: false })).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryAllByLabelText(NO_MATCHES_TEXT, { exact: false })).toEqual([]);

  await expect(screen.findAllByLabelText(TEXT_LABEL, { exact: false })).resolves.toHaveLength(2);
  await expect(screen.findAllByLabelText(NO_MATCHES_TEXT, { exact: false })).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
});

describe('findBy options deprecations', () => {
  let warnSpy: jest.SpyInstance;
  beforeEach(() => {
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('findByText queries warn on deprecated use of WaitForOptions', async () => {
    const options = { timeout: 10 };
    // mock implementation to avoid warning in the test suite
    render(<View />);
    await expect(screen.findByLabelText('Some Text', options)).rejects.toBeTruthy();

    setTimeout(() => screen.rerender(<View accessibilityLabel="Some Text" />), 20);
    await expect(screen.findByLabelText('Some Text')).resolves.toBeTruthy();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Use of option "timeout"'));
  }, 20000);
});

test('byLabelText queries support hidden option', () => {
  render(
    <Text accessibilityLabel="hidden" style={{ display: 'none' }}>
      Hidden from accessibility
    </Text>,
  );

  expect(screen.getByLabelText('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByLabelText('hidden')).toBeFalsy();
  expect(screen.queryByLabelText('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByLabelText('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility label: hidden

    <>
      <Text
        accessibilityLabel="hidden"
        style={
          {
            "display": "none",
          }
        }
      >
        Hidden from accessibility
      </Text>
    </>"
  `);
});

test('getByLabelText supports aria-label', () => {
  render(
    <>
      <View testID="view" aria-label="view-label" />
      <Text testID="text" aria-label="text-label">
        Text
      </Text>
      <TextInput testID="text-input" aria-label="text-input-label" />
    </>,
  );

  expect(screen.getByLabelText('view-label')).toBe(screen.getByTestId('view'));
  expect(screen.getByLabelText('text-label')).toBe(screen.getByTestId('text'));
  expect(screen.getByLabelText('text-input-label')).toBe(screen.getByTestId('text-input'));
});

test('getByLabelText supports accessibilityLabelledBy', () => {
  render(
    <>
      <Text nativeID="label">Label for input</Text>
      <TextInput testID="textInput" accessibilityLabelledBy="label" />
    </>,
  );

  expect(screen.getByLabelText('Label for input')).toBe(screen.getByTestId('textInput'));
  expect(screen.getByLabelText(/input/)).toBe(screen.getByTestId('textInput'));
});

test('getByLabelText supports nested accessibilityLabelledBy', () => {
  render(
    <>
      <View nativeID="label">
        <Text>Label for input</Text>
      </View>
      <TextInput testID="textInput" accessibilityLabelledBy="label" />
    </>,
  );

  expect(screen.getByLabelText('Label for input')).toBe(screen.getByTestId('textInput'));
  expect(screen.getByLabelText(/input/)).toBe(screen.getByTestId('textInput'));
});

test('getByLabelText supports aria-labelledby', () => {
  render(
    <>
      <Text nativeID="label">Text Label</Text>
      <TextInput testID="text-input" aria-labelledby="label" />
    </>,
  );

  expect(screen.getByLabelText('Text Label')).toBe(screen.getByTestId('text-input'));
  expect(screen.getByLabelText(/text label/i)).toBe(screen.getByTestId('text-input'));
});

test('getByLabelText supports nested aria-labelledby', () => {
  render(
    <>
      <View nativeID="label">
        <Text>Nested Text Label</Text>
      </View>
      <TextInput testID="text-input" aria-labelledby="label" />
    </>,
  );

  expect(screen.getByLabelText('Nested Text Label')).toBe(screen.getByTestId('text-input'));
  expect(screen.getByLabelText(/nested text label/i)).toBe(screen.getByTestId('text-input'));
});

test('getByLabelText supports "Image"" with "alt" prop', () => {
  render(
    <>
      <Image alt="Image Label" testID="image" />
    </>,
  );

  const expectedElement = screen.getByTestId('image');
  expect(screen.getByLabelText('Image Label')).toBe(expectedElement);
  expect(screen.getByLabelText(/image label/i)).toBe(expectedElement);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<Pressable accessibilityLabel="LABEL" key="3" />);

  expect(() => screen.getByLabelText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility label: FOO

    <>
      <View
        accessibilityLabel="LABEL"
        accessible={true}
      />
    </>"
  `);

  expect(() => screen.getAllByLabelText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility label: FOO

    <>
      <View
        accessibilityLabel="LABEL"
        accessible={true}
      />
    </>"
  `);

  await expect(screen.findByLabelText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility label: FOO

    <>
      <View
        accessibilityLabel="LABEL"
        accessible={true}
      />
    </>"
  `);

  await expect(screen.findAllByLabelText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility label: FOO

    <>
      <View
        accessibilityLabel="LABEL"
        accessible={true}
      />
    </>"
  `);
});
