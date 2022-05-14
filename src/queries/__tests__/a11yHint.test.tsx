import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const BUTTON_HINT = 'click this button';
const TEXT_HINT = 'static text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string = NO_MATCHES_TEXT) => {
  return `Found multiple elements with accessibilityHint: ${value}`;
};

const getNoInstancesFoundMessage = (value: string = NO_MATCHES_TEXT) => {
  return `Unable to find an element with accessibilityHint: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity accessibilityHint={BUTTON_HINT}>
    <Typography accessibilityHint={TEXT_HINT}>{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityHint={TEXT_HINT}>Title</Typography>
    <Button>Hello</Button>
  </>
);

test('getByA11yHint, queryByA11yHint, findByA11yHint', async () => {
  const { getByA11yHint, queryByA11yHint, findByA11yHint } = render(
    <Section />
  );

  expect(getByA11yHint(BUTTON_HINT).props.accessibilityHint).toEqual(
    BUTTON_HINT
  );
  const button = queryByA11yHint(BUTTON_HINT);
  expect(button?.props.accessibilityHint).toEqual(BUTTON_HINT);

  expect(() => getByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage()
  );
  expect(queryByA11yHint(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByA11yHint(TEXT_HINT)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT)
  );
  expect(() => queryByA11yHint(TEXT_HINT)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT)
  );

  const asyncButton = await findByA11yHint(BUTTON_HINT);
  expect(asyncButton.props.accessibilityHint).toEqual(BUTTON_HINT);
  await expect(findByA11yHint(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage()
  );

  await expect(findByA11yHint(TEXT_HINT)).rejects.toThrow(
    getMultipleInstancesFoundMessage(TEXT_HINT)
  );
});

test('getAllByA11yHint, queryAllByA11yHint, findAllByA11yHint', async () => {
  const { getAllByA11yHint, queryAllByA11yHint, findAllByA11yHint } = render(
    <Section />
  );

  expect(getAllByA11yHint(TEXT_HINT)).toHaveLength(2);
  expect(queryAllByA11yHint(TEXT_HINT)).toHaveLength(2);

  expect(() => getAllByA11yHint(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage()
  );
  expect(queryAllByA11yHint(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByA11yHint(TEXT_HINT)).resolves.toHaveLength(2);
  await expect(findAllByA11yHint(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage()
  );
});
