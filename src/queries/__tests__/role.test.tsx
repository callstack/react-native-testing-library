import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

// Little hack to make all the methods happy with type
const NO_MATCHES_TEXT: any = 'not-existent-element';

const getMultipleInstancesFoundMessage = (
  name: string,
  value: string = NO_MATCHES_TEXT
) => {
  return `Found multiple elements with ${name}: ${value}`;
};

const getNoInstancesFoundMessage = (
  name: string,
  value: string = NO_MATCHES_TEXT
) => {
  return `Unable to find an element with ${name}: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

class Button extends React.Component<any> {
  render() {
    return (
      <TouchableOpacity accessibilityRole="button">
        <Typography accessibilityRole="link">{this.props.children}</Typography>
      </TouchableOpacity>
    );
  }
}

function Section() {
  return (
    <>
      <Typography accessibilityRole="link">Title</Typography>
      <Button>{TEXT_LABEL}</Button>
    </>
  );
}

test('getByRole, queryByRole, findByRole', async () => {
  const { getByRole, queryByRole, findByRole } = render(<Section />);

  expect(getByRole('button').props.accessibilityRole).toEqual('button');
  const button = queryByRole(/button/g);
  expect(button?.props.accessibilityRole).toEqual('button');

  expect(() => getByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryByRole(NO_MATCHES_TEXT)).toBeNull();

  expect(() => getByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('accessibilityRole', 'link')
  );
  expect(() => queryByRole('link')).toThrow(
    getMultipleInstancesFoundMessage('accessibilityRole', 'link')
  );

  const asyncButton = await findByRole('button');
  expect(asyncButton.props.accessibilityRole).toEqual('button');
  await expect(findByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  await expect(findByRole('link')).rejects.toThrow(
    getMultipleInstancesFoundMessage('accessibilityRole', 'link')
  );
});

test('getAllByRole, queryAllByRole, findAllByRole', async () => {
  const { getAllByRole, queryAllByRole, findAllByRole } = render(<Section />);

  expect(getAllByRole('link')).toHaveLength(2);
  expect(queryAllByRole(/ink/g)).toHaveLength(2);

  expect(() => getAllByRole(NO_MATCHES_TEXT)).toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
  expect(queryAllByRole(NO_MATCHES_TEXT)).toEqual([]);

  await expect(findAllByRole('link')).resolves.toHaveLength(2);
  await expect(findAllByRole(NO_MATCHES_TEXT)).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityRole')
  );
});
