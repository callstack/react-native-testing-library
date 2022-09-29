import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (value: string) => {
  return `Found multiple elements with accessibilityRole: ${value}`;
};

const getNoInstancesFoundMessage = (value: string) => {
  return `Unable to find an element with accessibilityRole: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

const Button = ({ children }: { children: React.ReactNode }) => (
  <TouchableOpacity accessibilityRole="button">
    <Typography accessibilityRole="link">{children}</Typography>
  </TouchableOpacity>
);

const Section = () => (
  <>
    <Typography accessibilityRole="link">Title</Typography>
    <Button>{TEXT_LABEL}</Button>
  </>
);

test('getByRole, queryByRole, findByRole', async () => {
  const { getByRole, queryByRole, findByRole } = render(<Section />);

  expect(getByRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByRole(/button/g);
  expect(button?.props.accessibilityRole).toEqual('button');

  expect(() => getByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );

  expect(queryByRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('link')
  );
  expect(() => queryByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('link')
  );

  const asyncButton = await findByRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(findByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
  await expect(findByRole('link')).rejects.toThrow(
    getMultipleInstancesFoundMessage('link')
  );
});

test('getAllByRole, queryAllByRole, findAllByRole', async () => {
  const { getAllByRole, queryAllByRole, findAllByRole } = render(<Section />);

  expect(getAllByRole('link')).toHaveLength(2);
  expect(queryAllByRole(/ink/g)).toHaveLength(2);

  expect(() => getAllByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
  expect(queryAllByRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByRole('link')).resolves.toHaveLength(2);
  await expect(findAllByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage(NO_MATCHES_TEXT)
  );
});

describe('supports name option', () => {
  test('returns an element that has the corresponding role and a children with the name', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role when several children include the name', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text>Save</Text>
        <Text>Save</Text>
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role and a children with a matching accessibilityLabel', () => {
    const { getByRole } = render(
      <TouchableOpacity accessibilityRole="button" testID="target-button">
        <Text accessibilityLabel="Save" />
      </TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element that has the corresponding role and a matching accessibilityLabel', () => {
    const { getByRole } = render(
      <TouchableOpacity
        accessibilityRole="button"
        testID="target-button"
        accessibilityLabel="Save"
      ></TouchableOpacity>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('button', { name: 'Save' }).props.testID).toBe(
      'target-button'
    );
  });

  test('returns an element when the direct child is text', () => {
    const { getByRole, getByTestId } = render(
      <Text accessibilityRole="header" testID="target-header">
        About
      </Text>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(
      getByTestId('target-header')
    );
    expect(getByRole('header', { name: 'About' }).props.testID).toBe(
      'target-header'
    );
  });

  test('returns an element with nested Text as children', () => {
    const { getByRole, getByTestId } = render(
      <Text accessibilityRole="header" testID="parent">
        <Text testID="child">About</Text>
      </Text>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(getByTestId('parent'));
    expect(getByRole('header', { name: 'About' }).props.testID).toBe('parent');
  });

  test('returns a header with an accessibilityLabel', () => {
    const { getByRole, getByTestId } = render(
      <Text
        accessibilityRole="header"
        testID="target-header"
        accessibilityLabel="About"
      ></Text>
    );

    // assert on the testId to be sure that the returned element is the one with the accessibilityRole
    expect(getByRole('header', { name: 'About' })).toBe(
      getByTestId('target-header')
    );
    expect(getByRole('header', { name: 'About' }).props.testID).toBe(
      'target-header'
    );
  });
});
