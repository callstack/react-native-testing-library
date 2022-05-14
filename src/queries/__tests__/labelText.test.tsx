import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const BUTTON_LABEL = 'cool button';
const BUTTON_HINT = 'click this button';
const TEXT_LABEL = 'cool text';
const TEXT_HINT = 'static text';
// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string = NO_MATCHES_TEXT) => {
  return `Found multiple elements with accessibilityLabel: ${value}`;
};

const getNoInstancesFoundMessage = (value: string = NO_MATCHES_TEXT) => {
  return `Unable to find an element with accessibilityLabel: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity
    accessibilityHint={BUTTON_HINT}
    accessibilityLabel={BUTTON_LABEL}
  >
    <Typography accessibilityHint={TEXT_HINT} accessibilityLabel={TEXT_LABEL}>
      {children}
    </Typography>
  </TouchableOpacity>
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
  const { getByLabelText, queryByLabelText, findByLabelText } = render(
    <Section />
  );

  expect(getByLabelText(BUTTON_LABEL).props.accessibilityLabel).toEqual(
    BUTTON_LABEL
  );
  const button = queryByLabelText(/button/g);
  expect(button?.props.accessibilityLabel).toEqual(BUTTON_LABEL);

  expect(() => getByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage()
  );
  expect(queryByLabelText(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByLabelText(TEXT_LABEL)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL)
  );
  expect(() => queryByLabelText(TEXT_LABEL)).toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL)
  );

  const asyncButton = await findByLabelText(BUTTON_LABEL);
  expect(asyncButton.props.accessibilityLabel).toEqual(BUTTON_LABEL);
  await expect(findByLabelText(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage()
  );

  await expect(findByLabelText(TEXT_LABEL)).rejects.toThrow(
    getMultipleInstancesFoundMessage(TEXT_LABEL)
  );
});

test('getAllByLabelText, queryAllByLabelText, findAllByLabelText', async () => {
  const { getAllByLabelText, queryAllByLabelText, findAllByLabelText } = render(
    <Section />
  );

  expect(getAllByLabelText(TEXT_LABEL)).toHaveLength(2);
  expect(queryAllByLabelText(/cool/g)).toHaveLength(3);

  expect(() => getAllByLabelText(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage()
  );
  expect(queryAllByLabelText(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByLabelText(TEXT_LABEL)).resolves.toHaveLength(2);
  await expect(findAllByLabelText(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage()
  );
});
