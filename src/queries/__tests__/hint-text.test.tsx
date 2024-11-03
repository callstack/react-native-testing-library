import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { render, screen } from '../..';

const BUTTON_HINT = 'click this button';
const TEXT_HINT = 'static text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibility hint: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibility hint: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <Pressable accessibilityHint={BUTTON_HINT}>
    <Typography accessibilityHint={TEXT_HINT}>{children}</Typography>
  </Pressable>
);

const Section = () => (
  <View>
    <Typography accessibilityHint={TEXT_HINT}>Title</Typography>
    <Button>Hello</Button>
  </View>
);

test('getByA11yHint, queryByA11yHint, findByA11yHint', async () => {
  render(<Section />);

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <View>
      <Text
        accessibilityHint="static text"
      >
        Title
      </Text>
      <View
        accessibilityHint="click this button"
        accessibilityState={
          {
            "busy": undefined,
            "checked": undefined,
            "disabled": undefined,
            "expanded": undefined,
            "selected": undefined,
          }
        }
        accessibilityValue={
          {
            "max": undefined,
            "min": undefined,
            "now": undefined,
            "text": undefined,
          }
        }
        accessible={true}
        collapsable={false}
        focusable={true}
        onBlur={[Function]}
        onClick={[Function]}
        onFocus={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
      >
        <Text
          accessibilityHint="static text"
        >
          Hello
        </Text>
      </View>
    </View>
  `);

  expect(screen.getByA11yHint(BUTTON_HINT).props.accessibilityHint).toEqual(BUTTON_HINT);
  const button = screen.queryByA11yHint(BUTTON_HINT);
  expect(button?.props.accessibilityHint).toEqual(BUTTON_HINT);

  expect(() => screen.getByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryByA11yHint(NO_MATCHES_TEXT)).toBeNull();

  expect(() => screen.getByA11yHint(TEXT_HINT)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT),
  );
  expect(() => screen.queryByA11yHint(TEXT_HINT)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT),
  );

  const asyncButton = await screen.findByA11yHint(BUTTON_HINT);
  expect(asyncButton.props.accessibilityHint).toEqual(BUTTON_HINT);
  await expect(screen.findByA11yHint(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );

  await expect(screen.findByA11yHint(TEXT_HINT)).rejects.toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT),
  );
});

test('getAllByA11yHint, queryAllByA11yHint, findAllByA11yHint', async () => {
  render(<Section />);

  expect(screen.getAllByA11yHint(TEXT_HINT)).toHaveLength(2);
  expect(screen.queryAllByA11yHint(TEXT_HINT)).toHaveLength(2);

  expect(() => screen.getAllByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
  expect(screen.queryAllByA11yHint(NO_MATCHES_TEXT)).toEqual([]);

  await expect(screen.findAllByA11yHint(TEXT_HINT)).resolves.toHaveLength(2);
  await expect(screen.findAllByA11yHint(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT),
  );
});

test('getByHintText, getByHintText', () => {
  render(
    <View>
      <View accessibilityHint="test" />
      <View accessibilityHint="tests id" />
    </View>,
  );
  expect(screen.getByHintText('id', { exact: false })).toBeTruthy();
  expect(screen.getAllByHintText('test', { exact: false })).toHaveLength(2);
});

test('getByHintText, getByHintText and exact = true', () => {
  render(
    <View>
      <View accessibilityHint="test" />
      <View accessibilityHint="tests id" />
    </View>,
  );
  expect(screen.queryByHintText('id', { exact: true })).toBeNull();
  expect(screen.getAllByHintText('test', { exact: true })).toHaveLength(1);
});

test('byHintText queries support hidden option', () => {
  render(
    <Text accessibilityHint="hidden" style={{ display: 'none' }}>
      Hidden from accessiblity
    </Text>,
  );

  expect(screen.getByHintText('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByHintText('hidden')).toBeFalsy();
  expect(screen.queryByHintText('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByHintText('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility hint: hidden

    <Text
      accessibilityHint="hidden"
      style={
        {
          "display": "none",
        }
      }
    >
      Hidden from accessiblity
    </Text>"
  `);
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<Pressable accessibilityHint="HINT" key="3" />);

  expect(() => screen.getByHintText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility hint: FOO

    <View
      accessibilityHint="HINT"
      accessible={true}
    />"
  `);

  expect(() => screen.getAllByHintText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility hint: FOO

    <View
      accessibilityHint="HINT"
      accessible={true}
    />"
  `);

  await expect(screen.findByHintText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility hint: FOO

    <View
      accessibilityHint="HINT"
      accessible={true}
    />"
  `);

  await expect(screen.findAllByHintText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with accessibility hint: FOO

    <View
      accessibilityHint="HINT"
      accessible={true}
    />"
  `);
});
