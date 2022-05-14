import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render } from '../..';

const TEXT_LABEL = 'cool text';

const getMultipleInstancesFoundMessage = (name: string, value: string) => {
  return `Found multiple elements with ${name}: ${value}`;
};

const getNoInstancesFoundMessage = (name: string, value: string) => {
  return `Unable to find an element with ${name}: ${value}`;
};

const Typography = ({ children, ...rest }: any) => {
  return <Text {...rest}>{children}</Text>;
};

class Button extends React.Component<any> {
  render() {
    return (
      <TouchableOpacity>
        <Typography accessibilityState={{ expanded: false, selected: true }}>
          {this.props.children}
        </Typography>
      </TouchableOpacity>
    );
  }
}

function Section() {
  return (
    <>
      <Typography accessibilityState={{ expanded: false }}>Title</Typography>
      <Button>{TEXT_LABEL}</Button>
    </>
  );
}

test('getByA11yState, queryByA11yState, findByA11yState', async () => {
  const { getByA11yState, queryByA11yState, findByA11yState } = render(
    <Section />
  );

  expect(getByA11yState({ selected: true }).props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  expect(
    queryByA11yState({ selected: true })?.props.accessibilityState
  ).toEqual({
    selected: true,
    expanded: false,
  });

  expect(() => getByA11yState({ disabled: true })).toThrow(
    getNoInstancesFoundMessage('accessibilityState', '{"disabled":true}')
  );
  expect(queryByA11yState({ disabled: true })).toEqual(null);

  expect(() => getByA11yState({ expanded: false })).toThrow(
    getMultipleInstancesFoundMessage('accessibilityState', '{"expanded":false}')
  );
  expect(() => queryByA11yState({ expanded: false })).toThrow(
    getMultipleInstancesFoundMessage('accessibilityState', '{"expanded":false}')
  );

  const asyncButton = await findByA11yState({ selected: true });
  expect(asyncButton.props.accessibilityState).toEqual({
    selected: true,
    expanded: false,
  });
  await expect(findByA11yState({ disabled: true })).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityState', '{"disabled":true}')
  );
  await expect(findByA11yState({ expanded: false })).rejects.toThrow(
    getMultipleInstancesFoundMessage('accessibilityState', '{"expanded":false}')
  );
});

test('getAllByA11yState, queryAllByA11yState, findAllByA11yState', async () => {
  const { getAllByA11yState, queryAllByA11yState, findAllByA11yState } = render(
    <Section />
  );

  expect(getAllByA11yState({ selected: true })).toHaveLength(1);
  expect(queryAllByA11yState({ selected: true })).toHaveLength(1);

  expect(() => getAllByA11yState({ disabled: true })).toThrow(
    getNoInstancesFoundMessage('accessibilityState', '{"disabled":true}')
  );
  expect(queryAllByA11yState({ disabled: true })).toEqual([]);

  expect(getAllByA11yState({ expanded: false })).toHaveLength(2);
  expect(queryAllByA11yState({ expanded: false })).toHaveLength(2);

  await expect(findAllByA11yState({ selected: true })).resolves.toHaveLength(1);
  await expect(findAllByA11yState({ disabled: true })).rejects.toThrow(
    getNoInstancesFoundMessage('accessibilityState', '{"disabled":true}')
  );
  await expect(findAllByA11yState({ expanded: false })).resolves.toHaveLength(
    2
  );
});
